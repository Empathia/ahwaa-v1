class ReplyObserver < ActiveRecord::Observer

  def after_create(reply)
    user = reply.user

    if user
      user.update_score_board(reply.points_granted)

      if !reply.as_anonymous? && !reply.topic.subscribed?(reply.user)
        reply.user.subscribe_to(reply.topic)
      end
    end

    StreamMessage.create(:reply => reply)

    reply.topic.notify_subscribers_about_new_response(reply)
    reply.topic.notify_author_about_new_response(reply)
  end

end
