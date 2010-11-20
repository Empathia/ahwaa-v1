# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :rating do |f|
  f.user { |r| r.association(:user) }
  f.reply { |r| r.association(:reply) }
  f.vote 1
end

Factory.define :flag, :parent => :rating do |f|
  f.vote Rating::FLAG 
end

Factory.define :vote_up, :parent => :rating do |f|
  f.vote Rating::VOTE_UP 
end
