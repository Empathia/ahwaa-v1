class CreateStreamMessages < ActiveRecord::Migration
  def self.up
    create_table :stream_messages do |t|
      t.belongs_to :reply
      t.belongs_to :topic

      t.timestamps
    end
  end

  def self.down
    drop_table :stream_messages
  end
end
