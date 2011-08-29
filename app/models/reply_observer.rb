class ReplyObserver < ActiveRecord::Observer

  def after_create(reply)
    user = reply.user

    if user
      user.update_score_board(reply.points_granted)

      reply.user.subscribe_to(reply.topic) unless reply.topic.subscribed?(reply.user)
    end

    StreamMessage.create(:reply => reply)

    reply.topic.notify_subscribers_about_new_response(reply)
  end

end
