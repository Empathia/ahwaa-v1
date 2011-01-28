class PrivateMessage < ActiveRecord::Base
  belongs_to :parent, :class_name => "PrivateMessage"
  belongs_to :sender, :class_name => "User"
  belongs_to :recipient, :class_name => "User"
  has_many :replies, :class_name => "PrivateMessage", :foreign_key => :parent_id
  has_one :received_message

  before_create :prepare_copies
  after_create :send_notifications
  after_create :set_conversation_to_received

  validates :content, :presence => true
  validates :sender_id, :presence => true
  validates :recipient_id, :presence => true

  # Builds an instance setting the available params,
  # like recipient and parent
  def self.build_from_params(params, sender)
    new(params[:private_message]).tap do |pm|
      pm.recipient = User.find_by_username(params[:user_id])
      pm.sender = sender
      pm.parent = PrivateMessage.find(params[:reply_to]) if params[:reply_to]
    end
  end

  # Wether or not the conversation has any of its relies unread by the passed user
  def unread_by?(user)
    received_message.try(:unread?) || replies.map { |r|
      r.received_message if r.recipient == user
    }.compact.any?(&:unread?)
  end

  # Marks all the conversation for the passed users as read
  def read_for!(user)
    received_message.read! if received_message
    replies.map { |r|
      r.received_message if r.recipient == user
    }.compact.each(&:read!)
  end

  def received_messages_thread(user)
    ([received_message] + replies.where(:recipient_id => user.id).map(&:received_message)).compact
  end

  private

  def set_conversation_to_received
    received_message.conversation_id = parent ? parent.id : id
  end

  def prepare_copies
    return if recipient.blank?
    build_received_message(:recipient_id => recipient.id)
  end

  def send_notifications
    recipient.notify_private_message!(sender)
  end
end
