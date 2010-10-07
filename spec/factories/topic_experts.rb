# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :topic_expert do |f|
  f.topic { |t| t.association(:topic) }
  f.expert { |t| t.association(:user) }
end
