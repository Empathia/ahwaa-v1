class CreateUserProfiles < ActiveRecord::Migration
  def self.up
    create_table :user_profiles do |t|
      t.belongs_to :user
      t.integer :religion_id
      t.integer :sexual_orientation_id
      t.integer :country_id
      t.integer :gender_id
      t.integer :age_id
      t.integer :political_view_id
      t.string :language
      t.string :time_zone
      t.timestamps
    end

    add_index :user_profiles, :user_id
    add_index :user_profiles, 
      [:religion_id, :sexual_orientation_id, :gender_id, :age_id, :political_view_id],
      :name => 'user_profiles_profile_match_index'
  end

  def self.down
    drop_table :user_profiles
  end
end
