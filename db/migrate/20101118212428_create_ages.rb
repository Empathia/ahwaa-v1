class CreateAges < ActiveRecord::Migration
  def self.up
    create_table :ages do |t|
      t.string :range
      t.timestamps
    end

    Age.create(['12-16', '18-25', '24-35',
               '40-50', '50-65', '65+'].map { |i| {:range => i} })
  end

  def self.down
    drop_table :ages
  end
end
