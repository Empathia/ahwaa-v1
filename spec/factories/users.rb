# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :user do |f|
  f.sequence(:username) { |n| "foobar#{n}" }
  f.sequence(:email) { |n| "foo-#{n}@example.com" }
  f.password "123456"
  f.password_confirmation { |u| u.password }
end

Factory.define :admin, :class => User  do |f|
  f.sequence(:username) { |n| "admin#{n}" }
  f.sequence(:email) { |n| "admin-#{n}@example.com" }
  f.password "123456"
  f.password_confirmation { |u| u.password }
  f.is_admin true
end