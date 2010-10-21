class TopicRequest < ActiveRecord::Base

  has_many :topic_request_votes
  has_many :users, :through => :topic_request_votes, :uniq => true
  belongs_to :user

  validates_presence_of :title
  validates_presence_of :user_id
  validates_uniqueness_of :title

  # This scope returns the topic requests ordered by most voted
  # the only caveat is that non voted topic requests wont appear
  # in the list
  scope :most_voted, lambda {
    includes(:topic_request_votes).
    group('topic_request_votes.topic_request_id').
    order('COUNT(topic_request_votes.user_id) DESC')
  }

  # casts a vote from a user, returns false if vote fails
  #
  # the vote might fail if the user has already voted
  def vote!(user_voted)
    users << user_voted rescue false
    true
  end

  def votes
    users.count
  end

end
