class Reply < ActiveRecord::Base
  POINTS_FOR_POSTING = 5
  CATEGORIES = %w[advice comment experience]
  
  # TODO: attr_accessible

  belongs_to :topic, :counter_cache => true
  belongs_to :user
  belongs_to :parent, :class_name => "Reply"
  has_many :vote_ups, :class_name => 'Rating', :dependent => :destroy,
    :conditions => { :vote => Rating::VOTE_UP }
  has_many :flags, :class_name => 'Rating', :dependent => :destroy,
    :conditions => { :vote => Rating::FLAG }
  has_many :ratings, :dependent => :destroy
  has_many :replies, :foreign_key => :parent_id, :conditions => { :contextual_index => nil }

  validates :content, :presence => true
  validates :topic_id, :presence => true
  validates :category, :presence => true
  validate :type_of_reply, :unless => "category.blank?"

  before_validation :set_topic_from_parent, :unless => "parent.nil?"
  before_save :check_bad_words
  before_save :nullify_contextual_index

  scope :latest, order("created_at DESC").limit(5)
  scope :flagged, :include => :ratings, :conditions => "ratings.vote = #{Rating::FLAG}"

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

  # Votes up the reply
  def vote_up!(user)
    vote_ups.create(:user => user)
  end

  # Flags reply
  def flag!(user)
    flags.create(:user => user)
  end

  # Wether the user of the reply is null or not
  def anonymous?
    user.nil?
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
end
