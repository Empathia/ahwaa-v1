class CreateVisitedTopics < ActiveRecord::Migration
  def self.up
    create_table :visited_topics do |t|
      t.belongs_to :user
      t.belongs_to :topic
      t.integer :visits, :default => 1

      t.timestamps
    end

    add_index :visited_topics, :user_id
    add_index :visited_topics, :topic_id
  end

  def self.down
    drop_table :visited_topics
  end
end
