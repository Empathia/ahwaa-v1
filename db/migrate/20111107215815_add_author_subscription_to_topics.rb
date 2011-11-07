class AddAuthorSubscriptionToTopics < ActiveRecord::Migration
  def self.up
    add_column :topics, :author_subscription, :string
    add_index :topics, :author_subscription

    Topic.all.each do |topic|
      topic.generate_author_notification
      topic.save
    end
  end

  def self.down
    remove_index :topics, :author_subscription
    remove_column :topics, :author_subscription
  end
end
