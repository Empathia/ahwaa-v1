class AddIndexesToStreamUsers < ActiveRecord::Migration
  def self.up
    add_index :stream_users, [:user_id, :stream_message_id]
  end

  def self.down
    remove_index :stream_users, [:user_id, :stream_message_id]
  end
end
