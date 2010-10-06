# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :bad_word do |f|
  f.sequence(:word){|n| "word#{n}" }
end
