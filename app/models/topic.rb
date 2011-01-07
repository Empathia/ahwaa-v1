class Topic < ActiveRecord::Base
  acts_as_taggable

  # TODO: attr_accessible
  
  has_friendly_id :title, :use_slug => true

  include Tanker

  tankit 'lgbt' do
    indexes :title
    indexes :content
    indexes :tag_list
  end

  belongs_to :user
  has_many :replies, :dependent => :destroy, :conditions => "contextual_index IS NOT NULL"
  has_many :all_replies, :class_name => "Reply", :dependent => :destroy
  has_many :users, :through => :replies
  has_many :topic_experts, :dependent => :destroy
  has_many :experts, :through => :topic_experts
  has_many :related_contents

  validates :title, :presence => true
  validates :content, :presence => true
  validates :user_id, :presence => true

  after_save :update_tank_indexes, :if => 'Rails.env.production?'
  after_destroy :delete_tank_indexes, :if => 'Rails.env.production?'
  after_create :ensure_topic_request_deletion, :if => "from_request.present?"

  scope :by_language, lambda { |lang| where("language = :lang", :lang => lang) }
  scope :by_replies_count, lambda { |*lang| by_language(lang.first || 'en').order("replies_count DESC") }
  scope :newest, lambda { |*lang| by_language(lang.first || 'en').order("created_at DESC") }
  scope :popular, lambda { |*lang| by_replies_count(lang.first || 'en').limit(5) }

  def self.per_page
    10
  end

  # Creates an instance from the request attributes
  def self.build_from_request(request_id)
    topic_request = TopicRequest.find_by_id(request_id)
    return new unless topic_request
    topic = new(topic_request.attributes.slice("title", "content", "language", "user_id"))
    topic.from_request = request_id
    topic.user_id = nil if topic_request.anonymous_post?
    topic
  end

  # Finds most active users in the topic
  def most_active_users
    ids = replies.count(:user_id,
                        :group => :user_id,
                        :order => "count_user_id DESC",
                        :limit => (4 - experts.length)).keys
    User.find(ids.compact)
  end

  # Get topic users leaderboard
  def leaderboard
    (experts + most_active_users).uniq
  end

  private

  def ensure_topic_request_deletion
    TopicRequest.find_by_id(from_request).try(:destroy)
  end

end
