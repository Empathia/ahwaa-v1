class ReplyObserver < ActiveRecord::Observer

  def after_create(reply)
    user = reply.user
    user.update_score_board(reply.points_granted) if user
  end

end
