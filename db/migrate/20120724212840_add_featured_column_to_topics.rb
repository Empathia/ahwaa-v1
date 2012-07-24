class AddFeaturedColumnToTopics < ActiveRecord::Migration
  def self.up
    add_column :topics, :featured, :boolean, :default => 0
  end

  def self.down
    remove_column :topics, :featured
  end
end
