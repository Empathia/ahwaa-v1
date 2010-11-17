class CreateScoreBoards < ActiveRecord::Migration
  def self.up
    create_table :score_boards do |t|
      t.integer :user_id
      t.integer :current_points
      t.integer :current_level_id
      t.integer :current_badge_id
      t.integer :current_prize_id

      t.timestamps
    end
  end

  def self.down
    drop_table :score_boards
  end
end
