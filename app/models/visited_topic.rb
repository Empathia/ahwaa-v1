class VisitedTopic < ActiveRecord::Base
  belongs_to :user
  belongs_to :topic

  validates_presence_of :user_id, :topic_id
  validates_uniqueness_of :topic_id, :scope => :user_id

  def self.visit!(topic, user)
    visited = user.visited_topics.find_by_topic_id(topic.id)
    if visited
      increment_counter(:visits, visited.id)
    else
      create(:user => user, :topic => topic)
    end
  end
end
