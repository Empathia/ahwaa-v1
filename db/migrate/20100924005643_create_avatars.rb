class CreateAvatars < ActiveRecord::Migration
  def self.up
    create_table :avatars do |t|
      t.string :url
      t.timestamps
    end

    add_column :user_profiles, :avatar_id, :integer
    add_index  :user_profiles, :avatar_id
  end

  def self.down
    remove_index  :user_profiles, :avatar_id
    remove_column :user_profiles, :avatar_id
    drop_table :avatars
  end
end
