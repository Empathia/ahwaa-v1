class CreateReplies < ActiveRecord::Migration
  def self.up
    create_table :replies do |t|
      t.belongs_to :topic
      t.belongs_to :user
      t.text :content
      t.string :category
      t.integer :contextual_index
      t.timestamps
    end

    add_index :replies, :topic_id
    add_index :replies, :user_id
    add_index :replies, :category
  end

  def self.down
    drop_table :replies
  end
end
