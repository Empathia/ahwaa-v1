class Reply < ActiveRecord::Base
  CATEGORIES = %w[advice comment experience]
  
  # TODO: attr_accessible

  belongs_to :topic
  belongs_to :user
  has_many :ratings, :dependent => :destroy
  has_many :raters, :through => :ratings, :source => :user

  validates :content, :presence => true
  validates :topic_id, :presence => true
  validates :category, :presence => true
  validates :contextual_index, :presence => true
  validate :type_of_reply, :unless => "category.blank?"

  # Returns the internationalized version of the categories
  def self.categories
    CATEGORIES.map { |c| I18n.t(:"activemodel.attributes.reply.categories.#{c}") }
  end

  # Wether the user of the reply is null or not
  def anonymous?
    user.nil?
  end

  private

  def type_of_reply
    errors.add(:category, :invalid) unless CATEGORIES.include?(category)
  end
end
