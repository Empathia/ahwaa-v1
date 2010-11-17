class CreateRewards < ActiveRecord::Migration
  def self.up
    create_table :rewards do |t|
      t.string :type
      t.string :name
      t.text :description
      t.integer :amount_points_of_required
      t.string :image_url

      t.timestamps
    end
  end

  def self.down
    drop_table :rewards
  end
end
