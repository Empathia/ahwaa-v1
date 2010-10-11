class Reply < ActiveRecord::Base
  CATEGORIES = %w[advice comment experience]
  
  # TODO: attr_accessible

  belongs_to :topic
  belongs_to :user
  belongs_to :parent, :class_name => "Reply"
  has_many :ratings, :dependent => :destroy
  has_many :raters, :through => :ratings, :source => :user
  has_many :replies, :foreign_key => :parent_id

  validates :content, :presence => true
  validates :topic_id, :presence => true
  validates :category, :presence => true
  validate :type_of_reply, :unless => "category.blank?"

  before_validation :set_topic_from_parent, :unless => "parent.nil?"

  # Returns the internationalized version of the categories
  def self.categories
    CATEGORIES.map { |c| I18n.t(:"activemodel.attributes.reply.categories.#{c}") }
  end

  # Wether the user of the reply is null or not
  def anonymous?
    user.nil?
  end

  # Wether the reply is from an expert user or no
  def from_expert?
    !anonymous? && user.is_expert?
  end

  # URL for the avatar of the user, or default image if anonymous
  def autor_avatar
    anonymous? ? Avatar.default.url : user.profile.avatar.url
  end
  
  def i18n_category
    I18n.t(:"activemodel.attributes.reply.categories.#{category}")
  end
  private

  def set_topic_from_parent
    self.topic = parent.topic
  end

  def type_of_reply
    errors.add(:category, :invalid) unless CATEGORIES.include?(category)
  end  
end
