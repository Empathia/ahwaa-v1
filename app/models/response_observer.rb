class ResponseObserver < ActiveRecord::Observer
  observe :reply

  def after_create(reply)
    unless reply.anonymous?
      subscription = Subscription.find_by_topic_id_and_user_id(reply.topic.id, reply.user.id)
      reply.user.subscribe_to(reply.topic) unless subscription
    end
    reply.topic.notify_subscribers_about_new_response(reply)
  end
end
