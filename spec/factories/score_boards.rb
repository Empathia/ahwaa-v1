# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :score_board do |f|
  f.user_id 1
  #f.current_points 1
  f.current_level_id 1
  f.current_badge_id 1
  f.current_prize_id 1
end
