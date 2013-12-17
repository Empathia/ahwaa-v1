# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :chat_invite do |f|
  f.user_id 1
  f.chat_room_id 1
  f.checked false
end
