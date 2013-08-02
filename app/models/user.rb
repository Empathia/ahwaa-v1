class User < ActiveRecord::Base
  attr_accessor :password

  has_one :profile, :class_name => "UserProfile", :dependent => :destroy
  has_one :score_board,   :dependent => :destroy
  has_one :current_level, :through => :score_board, :class_name => "Level", :source => :level
  has_one :current_badge, :through => :score_board, :class_name => "Badge", :source => :badge
  has_one :current_prize, :through => :score_board, :class_name => "Prize", :source => :prize
  has_many :subscriptions, :dependent => :destroy

  has_many :ratings, :dependent => :destroy
  has_many :replies, :dependent => :destroy
  has_many :rated_replies, :through => :ratings, :source => :reply
  has_many :received_messages, :foreign_key => :recipient_id,
    :dependent => :destroy, :group => :conversation_id # NOTE: for some reason, group option it's ignored when doing .paginate() so calling .group() manually on controllers is needed
  has_many :notifications, :foreign_key => :receiver_id
  has_many :topic_requests
  has_many :topics
  has_many :stream_users, :dependent => :destroy
  has_many :stream_messages, :through => :stream_users
  has_many :visited_topics, :dependent => :destroy

  has_many :blocks
  has_many :users, :through => :blocks, :uniq => true

  attr_accessible :username, :email, :password, :password_confirmation, :profile_attributes

  before_create :build_profile
  before_create :build_score_board
  before_save :set_encrypted_password, :if => :should_require_password?
  before_destroy :change_topics_owner
  after_create :subscribe_to_campaign_monitor

  validates :username, :uniqueness => true, :presence => true,
    :format => { :with => /^[\w-]+$/ }
  validates :password, :confirmation => true,
    :presence => { :if => :should_require_password? }
  validates :email, :uniqueness => true, :email => true

  accepts_nested_attributes_for :profile

  scope :admins, where(:is_admin => true)
  scope :idle, select('COUNT(replies.user_id) AS replies_count, COUNT(topic_requests.user_id) as topic_requests_count, users.*')\
                .joins("LEFT OUTER JOIN replies ON (replies.user_id = users.id AND replies.created_at > date_sub(CURDATE(), interval 3 month))")\
                .joins("LEFT OUTER JOIN topic_requests ON (topic_requests.user_id = users.id AND topic_requests.created_at > date_sub(CURDATE(), interval 3 month))")\
                .where("users.created_at < date_sub(CURDATE(), interval 3 month)")\
                .group('users.id')\
                .having('replies_count <= 1 AND topic_requests_count <= 1')
  scope :inactive, select('COUNT(replies.user_id) AS replies_count, COUNT(topic_requests.user_id) as topic_requests_count, COUNT(visited_topics.user_id) as visited_topics_count, users.*')\
                .joins("LEFT OUTER JOIN replies ON (replies.user_id = users.id AND replies.created_at > date_sub(CURDATE(), interval 6 month))")\
                .joins("LEFT OUTER JOIN topic_requests ON (topic_requests.user_id = users.id AND topic_requests.created_at > date_sub(CURDATE(), interval 6 month))")\
                .joins("LEFT OUTER JOIN visited_topics ON (visited_topics.user_id = users.id AND visited_topics.created_at > date_sub(CURDATE(), interval 6 month))")\
                .where("users.created_at < date_sub(CURDATE(), interval 6 month)")\
                .group('visited_topics.user_id, users.id')\
                .having('replies_count <= 1 AND topic_requests_count <= 1 AND visited_topics_count <= 1')
  scope :suggestions_with_similar_topics, lambda{ |user, topic_ids|
                joins("LEFT OUTER JOIN subscriptions ON (subscriptions.user_id = users.id AND subscriptions.topic_id IN (#{topic_ids}))")\
                .where("users.id != ? and subscriptions.topic_id is not NULL", user.id)\
                .group('users.id')\
                .having('count(users.id) >= 2')\
                .order('count(users.id) desc, RAND()')\
                .limit(4)
              }
  scope :suggestions_with_similar_profile, lambda{ |user_profile|
                includes(:profile)\
                .where('users.id != ?', user_profile.user_id)\
                .where('users.deleted = ?', false)\
                .where(:user_profiles => {:country_id => user_profile.country_id, :sexual_orientation_id => user_profile.sexual_orientation_id, :religion_id => user_profile.religion_id, :language => user_profile.language } )\
                .limit(4)
              }
  scope :blocked_by, lambda{ |current_user,user|
        joins("LEFT OUTER JOIN blocks ON (blocks.blocked_id = users.id)")\
        .where("users.id = ? and blocks.user_id = ?", current_user.id, user.id)}

  def recent_replies
    Reply.where(:id => self.replies.select('max(id) as id').group(:topic_id).where("as_anonymous = 0").order('id desc').limit(3).map(&:id))
  end

  def visit_topic!(topic)
    VisitedTopic.visit!(topic, self)
  end

  # Gets recommended topics for the user based on the
  # topics he have visited
  def recommended_topics(limit = 10)
    visited_topics.joins(:topic).where('topics.language = ?', I18n.locale).group('topic_id').order("visits DESC, updated_at DESC").limit(limit).map(&:topic).map { |t| t.find_related_tags.limit(2) }.flatten.uniq[0...limit]
  end

  def filtered_stream_users(filter, lang = 'en')
    su = if filter == 'followed'
      stream_users.followed
    elsif filter == 'owned'
      stream_users.owned
    else
      stream_users
    end
    su.joins(:stream_message => { :reply => :topic }).where("topics.language = ?", lang).order('stream_users.created_at DESC')
  end

  # Get if is a new user or not
  def new_user?
    self.created_at > 1.month.ago
  end

  def blocked_user?(user)
    Block.where("user_id = #{user.id} AND blocked_id = #{self.id}").present?
  end

  # Get if the user already thanked the topic specified
  def already_thanked?(topic)
    notification = Notification.thanked_by(self.id, topic.id)
    !notification.empty?
  end

  # Get if the user already welcomed the user specified
  def already_welcomed?(user)
    notification = Notification.welcomed_by(self.id, user.id)
    !notification.empty?
  end

  # Adds a subscription for the user to the given topic
  def subscribe_to(topic)
    StreamUser.create(:user => self, :stream_message => topic.stream_messages.last, :source => 'followed') if topic.stream_messages.last
    subscriptions << Subscription.new(:topic => topic)
  end

  # Removes subscriptions for this user to the given topic
  def unsubscribe_from(topic)
    subscriptions.find_by_topic_id(topic.id).try(:destroy)
  end

  # Finds subscription to the given topic
  def subscription_for(topic)
    subscriptions.where(:topic_id => topic.id).first
  end

  # if a user is destroyed change the ownership of its topics to admin
  def change_topics_owner
    self.topics.each do |topic|
      topic.user = User.where(:is_admin => true).first
      topic.save!
    end
  end

  def to_param
    username
  end

  # send notification to participate in a topic
  def notify_about_topic!(topic)
    with_user_locale do
      UserMailer.topic_match_notification(self, topic).deliver!
    end
  end

  # sends notification for password reset
  def notify_password_reset!
    with_user_locale do
      reset_single_access_token!
      UserMailer.password_reset(self).deliver!
    end
  end

  # sends notification for sign up confirmation
  def notify_sign_up_confirmation!
    UserMailer.sign_up_confirmation(self).deliver!
  end

  # sends notification for private message
  def notify_private_message!(sender)
    with_user_locale do
      UserMailer.private_message_notification(self, sender).deliver!
    end
  end

  # sends notifications to admins about a topic request
  def self.notify_about_topic_request!(topic)
    admins.each do |admin|
      admin.with_user_locale do
        UserMailer.topic_request_notification(admin, topic).deliver!
      end
    end
  end

  # sets a prize badge or level or whatever reward model for the matter
  def set_reward(reward)
    self.send("current_#{reward.class.to_s.underscore}=",reward)
  end

  # updates the scoreboard
  def update_score_board(by)
    self.score_board.update_attributes!(:current_points => self.score_board.current_points + by)
  end

  # Finds user by username or email
  def self.find_for_database_authentication(login_value)
    where(["username = :value OR email = :value", { :value => login_value }]).first
  end

  # Resets single access token for user
  def reset_single_access_token!
    update_attribute(:single_access_token, User.encrypt_token(Time.now.to_i, "password reset--"))
  end

  # Encrypts a string with a given salt
  def self.encrypt_token(token, salt)
    hash = salt
    10.times do |i|
      hash = Digest::SHA1.hexdigest([token, i, hash, salt].join)
    end
    hash
  end

  # Compares passed password with the one encrypted in the database
  def authenticate!(psw)
    User.encrypt_token(psw, password_salt) == encrypted_password
  end

  # Scopes a block to the user's profile locale
  def with_user_locale
    raise "No block given" unless block_given?
    begin
      tmp_locale = I18n.locale
      I18n.locale = profile.language
      yield
    ensure
      I18n.locale = tmp_locale
    end
  end

  private

  def subscribe_to_campaign_monitor
    CampaignMonitor.add_subscriber(self, 'all')
  end

  def should_require_password?
    !password.blank? || encrypted_password.blank?
  end

  def set_password_salt
    self.password_salt = User.encrypt_token("hey there! #{rand(1000)}", Time.now.to_i)
  end

  def set_encrypted_password
    set_password_salt if password_salt.blank?
    self.encrypted_password = User.encrypt_token(password, password_salt)
  end

end
