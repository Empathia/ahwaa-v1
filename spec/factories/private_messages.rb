# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :private_message do |f|
  f.sender { |p| p.association(:user) }
  f.content "Hey! this is a private message for you."
  f.recipient { |p| p.association(:user) }
  f.parent nil
  f.unread true
end
