class AddInviterKeyToChatInvites < ActiveRecord::Migration
  def self.up
    add_column :chat_invites, :inviter, :string
  end

  def self.down
    remove_column :chat_invites, :inviter
  end
end
