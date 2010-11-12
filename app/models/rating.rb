class Rating < ActiveRecord::Base
  # TODO: attr_accessible
  VOTE_UP = 1
  FLAG = -1
  belongs_to :user
  belongs_to :reply

  validates :user_id, :presence => true
  validates :reply_id, :presence => true
  validate :unique

  protected

  def unique
    exists = Rating.find_by_user_id_and_reply_id_and_vote(user_id, reply_id, vote)
    errors.add(:base, vote == VOTE_UP ? :voted : :flagged) if exists
  end
end
