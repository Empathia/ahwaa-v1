class TopicRequest < ActiveRecord::Base

  has_many :topic_request_votes
  has_many :users, :through => :topic_request_votes, :uniq => true
  belongs_to :user

  validates_presence_of :title
  validates_presence_of :user_id

  def vote!(user_voted)
    users << user_voted rescue true
    true
  end

  def votes
    users.count
  end
end
