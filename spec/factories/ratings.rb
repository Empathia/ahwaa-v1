# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :rating do |f|
  f.user { |r| r.association(:user) }
  f.reply { |r| r.association(:reply) }
  f.vote 1
end
