class AddOriginalTitleToTopicRequest < ActiveRecord::Migration
  def self.up
    add_column :topic_requests, :original_content, :text
    add_column :topic_requests, :original_title, :string
  end

  def self.down
    remove_column :topic_requests, :original_content
    remove_column :topic_requests, :original_title
  end
end
