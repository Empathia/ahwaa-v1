class Reward < ActiveRecord::Base
  validates_presence_of :type
  validates_presence_of :name
  validates_presence_of :description
  validates_presence_of :amount_points_of_required
end
