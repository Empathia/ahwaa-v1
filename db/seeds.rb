# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)
admin = User.new(:username => "admin", :password => "123456", :password_confirmation => "123456", :email => "admin@lgbt.com")
admin.is_admin = true
admin.save!
