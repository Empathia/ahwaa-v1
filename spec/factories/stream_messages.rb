# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :stream_message do |f|
  f.association(:reply)
end
