class TopicRequestVote < ActiveRecord::Base
  belongs_to :user
  belongs_to :topic_request

  validates_presence_of :user_id
  validates_presence_of :topic_request_id

  validates_uniqueness_of :user_id, :scope => :topic_request_id
end
