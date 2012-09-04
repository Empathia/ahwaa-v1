class SubscribersNotifier
  @queue = :notifications
  def self.perform(topic_id, reply_id)
    topic = Topic.find(topic_id)
    reply = Reply.find(reply_id)
    topic.subscribers.each do |user|
      user.with_user_locale do
        UserMailer.reply_notification(user, reply).deliver
      end unless user == reply.user
    end
  end
end
