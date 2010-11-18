class Rating < ActiveRecord::Base
  # TODO: attr_accessible
  POINTS_FOR_RATING = 1
  VOTE_UP = 10
  FLAG = -10
  belongs_to :user
  belongs_to :reply

  validates :user_id, :presence => true
  validates :reply_id, :presence => true
  validate :unique

  def grant_points_to_rater
    self.user ? POINTS_FOR_RATING : 0
  end

  def grant_points_to_rated
    self.vote == VOTE_UP ? VOTE_UP : 0
  end

  protected

  def unique
    exists = Rating.find_by_user_id_and_reply_id_and_vote(user_id, reply_id, vote)
    errors.add(:base, vote == VOTE_UP ? :voted : :flagged) if exists
  end

end
