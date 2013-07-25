class AddOriginalContentToRepliesAndTopicTitle < ActiveRecord::Migration
  def self.up
    add_column :replies, :original_content, :text
    add_column :topics, :original_title, :string
    add_column :topics, :original_content, :text
  end

  def self.down
    remove_column :replies, :original_content
    remove_column :topics, :original_title
  end
end
