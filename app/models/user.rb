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
  has_many :recent_replies, :class_name => "Reply", :limit => 3, :group => :topic_id
  has_many :rated_replies, :through => :ratings, :source => :reply
  has_many :received_messages, :foreign_key => :recipient_id,
    :dependent => :destroy, :group => :conversation_id # NOTE: for some reason, group option it's ignored when doing .paginate() so calling .group() manually on controllers is needed
  has_many :topic_requests
  has_many :topics
  has_many :stream_users, :dependent => :destroy
  has_many :stream_messages, :through => :stream_users
  has_many :visited_topics, :dependent => :destroy

  attr_accessible :username, :email, :password, :password_confirmation, :profile_attributes

  before_create :build_profile
  before_create :build_score_board
  before_validation :set_temp_password, :on => :create, :if => "password.blank?"
  before_save :set_encrypted_password, :if => :should_require_password?
  before_destroy :change_topics_owner

  validates :username, :uniqueness => true, :presence => true,
    :format => { :with => /^[\w-]+$/ }
  validates :password, :confirmation => true,
    :presence => { :if => :should_require_password? }
  validates :email, :uniqueness => true, :email => true

  accepts_nested_attributes_for :profile

  scope :admins, where(:is_admin => true)

  def visit_topic!(topic)
    VisitedTopic.visit!(topic, self)
  end

  # Gets recommended topics for the user based on the
  # topics he have visited
  def recommended_topics(limit = 10)
    visited_topics.order("visits DESC, updated_at DESC").limit(limit).map(&:topic).map { |t| t.find_related_tags.limit(2) }.flatten[0...limit]
  end

  def filtered_stream_users(filter)
    if filter == 'followed'
      stream_users.followed
    elsif filter == 'owned'
      stream_users.owned
    else
      stream_users
    end.order('created_at DESC')
  end

  # Adds a subscription for the user to the given topic
  def subscribe_to(topic)
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
      UserMailer.topic_match_notification(self, topic).deliver
    end
  end

  # sends notification for password reset
  def notify_password_reset!
    with_user_locale do
      reset_single_access_token!
      UserMailer.password_reset(self).deliver 
    end
  end

  # sends notification for sign up confirmation
  def notify_sign_up_confirmation!
    UserMailer.sign_up_confirmation(self).deliver
  end

  # sends notification for private message
  def notify_private_message!(sender)
    with_user_locale do
      UserMailer.private_message_notification(self, sender).deliver
    end
  end

  # sends notifications to admins about a topic request
  def self.notify_about_topic_request!(topic)
    admins.each do |admin|
      admin.with_user_locale do
        UserMailer.topic_request_notification(admin, topic).deliver
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

  def set_temp_password
    self.password = User.encrypt_token("temp_password", Time.now.to_i)[0...6]
  end

  def should_require_password?
    !password.blank? ||  encrypted_password.blank?
  end

  def set_password_salt
    self.password_salt = User.encrypt_token("hey there! #{rand(1000)}", Time.now.to_i)
  end

  def set_encrypted_password
    set_password_salt if password_salt.blank?
    self.encrypted_password = User.encrypt_token(password, password_salt)
  end

end
