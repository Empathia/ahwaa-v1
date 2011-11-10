class AddMetaDescriptionAndMetaKeywordsToTopics < ActiveRecord::Migration
  def self.up
    add_column :topics, :meta_description, :string
    add_column :topics, :meta_keywords, :string
  end

  def self.down
    remove_column :topics, :meta_keywords
    remove_column :topics, :meta_description
  end
end
