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

    add_index :score_boards, :user_id
    add_index :score_boards, :current_points
    add_index :score_boards, [:user_id, :current_points]
    add_index :score_boards, :current_level_id
    add_index :score_boards, :current_badge_id
    add_index :score_boards, :current_prize_id
  end

  def self.down
    drop_table :score_boards
  end
end
