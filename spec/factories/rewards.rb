# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :reward do |f|
  f.type "SomeRewardType"
  f.name "An awesome reward"
  f.description "Reward desctiption"
  f.amount_points_of_required 1
  f.image_url "http://host/some_image.png"
end

# Level
Factory.define :level do |f|
  f.type 'Level'
  f.name "An awesome reward"
  f.description "Reward desctiption"
  f.amount_points_of_required 1
  f.image_url "http://host/some_image.png"
end

Factory.define :badge do |f|
  f.type 'Badge'
  f.name "An awesome reward"
  f.description "Reward desctiption"
  f.amount_points_of_required 1
  f.image_url "http://host/some_image.png"
end
