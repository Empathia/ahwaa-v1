# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :reply do |f|
  f.topic { |r| r.association(:topic) }
  f.user { |r| r.association(:user) }
  f.content "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede."
  f.category Reply::CATEGORIES.first
  f.contextual_index 1
end
