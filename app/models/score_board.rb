class ScoreBoard < ActiveRecord::Base

  belongs_to :user
  validates_presence_of :user_id
  validates_presence_of :current_points
  validates_numericality_of :current_points

  belongs_to :level, :class_name => "Level", :foreign_key => :current_level_id
  belongs_to :badge, :class_name => "Badge", :foreign_key => :current_badge_id
  belongs_to :prize, :class_name => "Prize", :foreign_key => :current_prize_id

  before_validation :set_default_current_points, :if => "current_points.nil?"
  private

  def set_default_current_points 
    self.current_points = 0
  end
end
