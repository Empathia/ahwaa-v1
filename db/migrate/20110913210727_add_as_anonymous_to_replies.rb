class AddAsAnonymousToReplies < ActiveRecord::Migration
  def self.up
    add_column :replies, :as_anonymous, :boolean, :default => false
  end

  def self.down
    remove_column :replies, :as_anonymous
  end
end
