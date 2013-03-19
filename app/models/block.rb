class Block < ActiveRecord::Base
  belongs_to :user
  belongs_to :block, :class_name => 'User', :foreign_key =>'blocked_id'
  
end
