class RatingObserver < ActiveRecord::Observer

  def after_create(rating)
    user = rating.reply.user rescue nil
    user.update_score_board(rating.points_granted) if user
  end

end
