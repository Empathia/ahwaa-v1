class CreateChatInvites < ActiveRecord::Migration
  def self.up
    create_table :chat_invites do |t|
      t.integer :user_id
      t.integer :chat_room_id
      t.boolean :checked

      t.timestamps
    end
  end

  def self.down
    drop_table :chat_invites
  end
end
