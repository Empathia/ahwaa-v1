class ReceivedMessage < ActiveRecord::Base
  belongs_to :private_message
  belongs_to :recipient, :class_name => "User"

  validates :recipient_id, :presence => true

  delegate :sender, :content, :to => :private_message

  # Wether or not the message has been read
  def unread?
    read_at.nil?
  end

  # Marks as read
  def read!
    update_attribute(:read_at, Time.now)
  end

  def conversation
    private_message.parent || private_message
  end

  def conversation_replies
    [conversation] + conversation.replies
  end
end
