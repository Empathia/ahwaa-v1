class PrivateMessage < ActiveRecord::Base
  # TODO: attr_accessible

  belongs_to :sender, :class_name => "User"
  belongs_to :recipient, :class_name => "User"
  belongs_to :parent, :class_name => "PrivateMessage"
  has_many :replies, :class_name => "PrivateMessage", :foreign_key => :parent_id,
    :dependent => :destroy, :order => "created_at DESC"

  validates :sender_id, :presence => true
  validates :recipient_id, :presence => true
  validates :content, :presence => true
  validate :replying_ownership, :unless => "parent_id.blank?"

  default_scope order("created_at DESC")

  # Builds an instance setting the available params,
  # like recipient and parent
  def self.build_from_params(params)
    new(params[:private_message]).tap do |pm|
      pm.recipient = User.find(params[:user_id])
      pm.parent = PrivateMessage.find(params[:reply_to]) if params[:reply_to]
    end
  end

  # Flags message if has any unread reply
  def has_unread_reply?
    replies.any?(&:unread?)
  end
  
  # Marks as read
  def read!
    update_attribute(:unread, false)
  end

  private

    # Validates that it's replying to a PM involving both recipient and sender
    def replying_ownership
      ownership = (parent.sender == sender && parent.recipient == recipient) ||
        (parent.sender == recipient && parent.recipient == sender)
      errors.add(:parent_id, :invalid) unless ownership
    end
end
