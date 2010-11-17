class Level < Reward
  has_many :score_boards, :foreign_key => :current_level_id
  has_many :users, :through => :score_boards
end
