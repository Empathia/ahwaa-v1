class ChatRoom < ActiveRecord::Base
  attr_accessible :label, :private, :user_id
  attr_accessor :invites
  attr_accessible :invites

  belongs_to :user
  has_many :room_users, :dependent => :destroy
  has_many :chat_invites, :dependent => :destroy
end
