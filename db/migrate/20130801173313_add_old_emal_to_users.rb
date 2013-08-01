class AddOldEmalToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :old_email, :string
  end

  def self.down
    delete_column :users, :old_email
  end
end
