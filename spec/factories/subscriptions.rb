# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :subscription do |f|
  f.association(:topic)
  f.association(:user)
  f.hash_key "askj48sjbrffkksdf823laf"
end
