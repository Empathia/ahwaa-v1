class AddPermanentToChatRooms < ActiveRecord::Migration
  def self.up
    add_column :chat_rooms, :permanent, :boolean, :default => false
  end

  def self.down
    remove_column :chat_rooms, :permanent
  end
end
