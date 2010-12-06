class CreateAges < ActiveRecord::Migration
  def self.up
    create_table :ages do |t|
      t.string :range
      t.timestamps
    end

    Age.create(['12-16', '17-24', '25-34',
               '35-50', '51-65', '65+'].map { |i| {:range => i} })
    add_index :ages, :range, :unique => true
  end

  def self.down
    drop_table :ages
  end
end
