# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :topic_request do |f|
  f.user_id 1
  f.title "MyString"
  f.annonymous_post false
end
