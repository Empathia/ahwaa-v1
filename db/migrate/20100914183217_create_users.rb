class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :username, :null => false
      t.string :email, :null => false
      t.string :encrypted_password, :null => false, :limit => 40
      t.string :password_salt, :null => false, :limit => 40
      t.integer :responses_count, :default => 0
      t.boolean :is_expert, :default => false
      t.boolean :is_admin, :default => false
      t.timestamps
    end

    add_index :users, :username, :unique => true
    add_index :users, :email, :unique => true
  end

  def self.down
    drop_table :users
  end
end
