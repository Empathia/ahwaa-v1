class Reply < ActiveRecord::Base
  POINTS_FOR_POSTING = 5
  CATEGORIES = %w[advice comment experience]

  # TODO: attr_accessible

  attr_accessor :check_field

  belongs_to :topic, :counter_cache => true
  belongs_to :user
  belongs_to :parent, :class_name => "Reply"
  has_many :vote_ups, :class_name => 'Rating', :dependent => :destroy,
    :conditions => { :vote => Rating::VOTE_UP }
  has_many :flags, :class_name => 'Rating', :dependent => :destroy,
    :conditions => { :vote => Rating::FLAG }
  has_many :ratings, :dependent => :destroy
  has_many :replies, :foreign_key => :parent_id, :conditions => { :contextual_index => nil }
  has_many :stream_messages, :dependent => :destroy

  validates :content, :presence => true
  validates :topic_id, :presence => true
  validates :category, :presence => true
  validates :user_id, :presence => true
  validate :type_of_reply, :unless => "category.blank?"
  validate :not_spam

  before_validation :set_topic_from_parent, :unless => "parent.nil?"
  before_save :check_bad_words
  before_save :nullify_contextual_index

  scope :by_topic_language, lambda { |lang| includes(:topic).where("topics.language = :lang", :lang => lang) }
  scope :latest, lambda { |*lang| by_topic_language(lang.first || 'en').order("replies.created_at DESC").limit(5) }
  scope :flagged, includes(:ratings).where("ratings.vote = :flag", :flag => Rating::FLAG)
  scope :by_category, lambda {|category| where(:category => category)}
  scope :not_anonymous, where("user_id IS NOT NULL AND as_anonymous = 0")

  # returns the amount of points granted this post produces
  def points_granted
    self.user ? POINTS_FOR_POSTING : 0
  end

  # Returns the internationalized version of the categories
  def self.categories
    categories_hash.values
  end

  # Returns a hash with raw category name as key, and i18n as value
  def self.categories_hash
    Hash[CATEGORIES.map { |category| [category, human_attribute_name(category)] }]
  end

  # Wether or not the reply has been rated more positive
  def useful?
    ratings.sum(:vote) > 0
  end

  # Wether or not the user already voted the reply
  def voted_by?(user)
    !!vote_ups.find_by_user_id(user.id) if user
  end

  # Votes up the reply
  def vote_up!(user)
    vote_ups.create(:user => user) unless voted_by?(user)
  end

  # Flags reply
  def flag!(user)
    flags.create(:user => user) unless flagged_by?(user)
  end

  # Wether or not the user already flagged the reply
  def flagged_by?(user)
    !!flags.find_by_user_id(user.id) if user
  end

  # Wether the user of the reply is null or not
  def anonymous?
    user.nil? || as_anonymous?
  end

  # Gets user's username, or 'anonymous'
  def author_username
    anonymous? ? Reply.human_attribute_name(:anonymous) : user.username
  end

  # Wether the reply is from an expert user or no
  def from_expert?
    !anonymous? && user.is_expert?
  end

  # URL for the avatar of the user, or default image if anonymous
  def author_avatar
    anonymous? ? Avatar.default.url : user.profile.avatar.url
  end

  def i18n_category
    Reply.human_attribute_name(category)
  end

  private

  def nullify_contextual_index
    self.contextual_index = nil if contextual_index.blank?
  end

  def check_bad_words
    self.content = BadWord.search_and_replace(content)
  end

  def set_topic_from_parent
    self.topic = parent.topic
  end

  def type_of_reply
    errors.add(:category, :invalid) unless CATEGORIES.include?(category)
  end

  # :check_field is a hidden field that should come empty unless
  # the submiter of the form is a bot. To avoid spam
  def not_spam
    errors.add(:base, "invalid reply") if check_field.present?
  end
end
