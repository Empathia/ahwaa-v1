# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :visited_topic do |f|
  f.association(:user)
  f.association(:topic)
  f.visits 1
end
