# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :avatar do |f|
  f.sequence(:url) {|n| "avatar-img#{n}.png" }
end
