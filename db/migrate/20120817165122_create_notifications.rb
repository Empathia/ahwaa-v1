class CreateNotifications < ActiveRecord::Migration
  def self.up
    create_table :notifications do |t|
      t.integer :sender_id
      t.integer :receiver_id
      t.belongs_to :topic
      t.belongs_to :private_message
      t.text :content
      t.string :category
      t.timestamps
    end
  end

  def self.down
    drop_table :notifications
  end
end
