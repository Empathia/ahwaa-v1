class CreateChatRooms < ActiveRecord::Migration
  def self.up
    create_table :chat_rooms do |t|
      t.integer :user_id
      t.string :label
      t.boolean :private

      t.timestamps
    end
  end

  def self.down
    drop_table :chat_rooms
  end
end
