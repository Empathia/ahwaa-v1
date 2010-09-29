class Reply < ActiveRecord::Base
  CATEGORIES = %w[advice comment experience]

  belongs_to :topic
  belongs_to :user

  validates :content, :presence => true
  validates :topic_id, :presence => true
  validates :category, :presence => true
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
