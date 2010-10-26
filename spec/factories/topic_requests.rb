# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :topic_request do |f|
  f.user_id 1
  f.sequence(:title) {|n| "title #{n}" }
  f.annonymous_post false
  f.content 'content'
end
