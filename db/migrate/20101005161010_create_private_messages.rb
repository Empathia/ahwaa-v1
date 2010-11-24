class CreatePrivateMessages < ActiveRecord::Migration
  def self.up
    create_table :private_messages do |t|
      t.belongs_to :parent
      t.belongs_to :sender
      t.belongs_to :recipient
      t.text :content
      t.timestamps
    end

    add_index :private_messages, :parent_id
    add_index :private_messages, :sender_id
    add_index :private_messages, :recipient_id
  end

  def self.down
    drop_table :private_messages
  end
end
