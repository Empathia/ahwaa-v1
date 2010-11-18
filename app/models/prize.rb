class Prize < Reward
  has_many :score_boards, :foreign_key => :current_prize_id
  has_many :users, :through => :score_boards
end
