class CreateUserProfiles < ActiveRecord::Migration
  def self.up
    create_table :user_profiles do |t|
      t.belongs_to :user
      t.string :country
      t.string :gender
      t.date   :birthdate
      t.string :language
      t.string :time_zone
      t.timestamps
    end

    add_index :user_profiles, :user_id
  end

  def self.down
    drop_table :user_profiles
  end
end
