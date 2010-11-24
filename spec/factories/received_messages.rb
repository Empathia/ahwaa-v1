# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :received_message do |f|
  f.association(:private_message)
  f.recipient { |p| p.association(:user) }
  f.read_at nil
end

