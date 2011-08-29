class StreamUser < ActiveRecord::Base
  belongs_to :stream_message
  belongs_to :user

  validates_presence_of :stream_message_id, :user_id
  validates_uniqueness_of :stream_message_id, :scope => :user_id
end
