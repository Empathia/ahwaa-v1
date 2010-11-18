class RatingObserver < ActiveRecord::Observer

  def after_create(rating)
    rated = rating.reply.user rescue nil
    rater = rating.user
    rated.update_score_board(rating.grant_points_to_rated) if rated
    rater.update_score_board(rating.grant_points_to_rater) if rater
  end

end
