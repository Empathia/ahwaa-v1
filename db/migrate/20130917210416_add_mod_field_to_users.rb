class AddModFieldToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :is_mod, :boolean, :default => false
  end

  def self.down
    remove_column :users, :is_mod
  end
end
