# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :user_profile do |f|
  f.user { |p| p.association(:user) }
  f.language "en"
end
