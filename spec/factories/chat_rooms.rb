# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :chat_room do |f|
  f.user_id 1
  f.label "MyString"
  f.private false
end
