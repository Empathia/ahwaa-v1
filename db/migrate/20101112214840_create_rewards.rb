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

    add_index :rewards, :type
    add_index :rewards, :amount_points_of_required
    add_index :rewards, [:amount_points_of_required, :type]
  end

  def self.down
    drop_table :rewards
  end
end
