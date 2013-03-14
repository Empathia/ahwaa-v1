class AddAnonymousFieldToTopics < ActiveRecord::Migration
  def self.up
    add_column :topics, :is_anonymous, :boolean, :default => 0
  end

  def self.down
    remove_column :topics, :is_anonymous
  end
end
