# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :user_profile do |f|
  f.user { |p| p.association(:user) }
  f.country "Mexico"
  f.gender "male"
  f.birthdate "1988-04-03"
  f.language "en"
end
