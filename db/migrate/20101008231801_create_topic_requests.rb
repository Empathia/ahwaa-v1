class CreateTopicRequests < ActiveRecord::Migration
  def self.up
    create_table :topic_requests do |t|
      t.integer :user_id
      t.string :title
      t.boolean :anonymous_post
      t.text    :content
      t.string :language

      t.timestamps
    end

    add_index :topic_requests, :user_id
  end

  def self.down
    drop_table :topic_requests
  end
end
