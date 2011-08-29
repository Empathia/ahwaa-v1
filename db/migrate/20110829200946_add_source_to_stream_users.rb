class AddSourceToStreamUsers < ActiveRecord::Migration
  def self.up
    add_column :stream_users, :source, :string, :default => 'followed'
  end

  def self.down
    remove_column :stream_users, :source
  end
end
