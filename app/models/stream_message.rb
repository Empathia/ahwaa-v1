class StreamMessage < ActiveRecord::Base
  belongs_to :reply
  belongs_to :topic
  has_many :stream_users, :dependent => :destroy

  before_save :set_topic_id
  after_create :publish_to_followers!
  # after_create :publish_to_owners!
  # after_create :publish_to_everyone!

  def title
    @title ||= begin
      key = "stream.title.reply.#{reply.category == 'comment' ? 'a' : 'an'}"
      I18n.t(key, :reply_type => reply.i18n_category)
     end
  end

  private

  def set_topic_id
    self.topic_id = reply.topic.id
  end

  def publish_to_followers!
    Resque.enqueue(Subscriber, reply.id, self.id)
  end

  def publish_to_owners!
    Resque.enqueue(SubscriberOwner, reply.id, self.id)
    true # Don't stop the world, if it's published then ignore
  end

  def publish_to_everyone!
    Resque.enqueue(SubscriberEverygs
      , self.id)
  end
end
