class StreamMessage < ActiveRecord::Base
  belongs_to :reply
  has_many :stream_users, :dependent => :destroy

  before_save :set_topic_id
  after_create :publish_to_followers!
  after_create :publish_to_owners!

  def title
    @title ||= begin
      key = "stream.title.reply.#{reply.category == 'comment' ? 'a' : 'an'}"
      user = reply.anonymous? ? Reply.human_attribute_name(:anonymous) : reply.user.username
      I18n.t(key, :user => user, :reply_type => reply.i18n_category)
     end
  end

  private

  def set_topic_id
    self.topic_id = reply.topic.id
  end

  def publish_to_followers!
    reply.topic.subscribers.each do |user|
      StreamUser.create(:user => user, :stream_message => self, :source => 'followed')
    end
  end

  def publish_to_owners!
    StreamUser.create(:user => reply.topic.user, :stream_message => self, :source => 'owned')
    true # Don't stop the world, if it's published then ignore
  end
end
