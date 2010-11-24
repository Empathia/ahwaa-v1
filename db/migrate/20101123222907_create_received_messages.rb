class CreateReceivedMessages < ActiveRecord::Migration
  def self.up
    create_table :received_messages do |t|
      t.belongs_to :private_message
      t.belongs_to :conversation
      t.belongs_to :recipient
      t.datetime :read_at
      t.timestamps
    end

    add_index :received_messages, :private_message_id
    add_index :received_messages, :conversation_id
    add_index :received_messages, :recipient_id
  end

  def self.down
    drop_table :received_messages
  end
end
