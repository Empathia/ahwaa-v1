class Rating < ActiveRecord::Base
  VOTES = [:not_useful, :useful, :very_useful]

  # TODO: attr_accessible

  belongs_to :user
  belongs_to :reply

  validates :user_id, :presence => true, :uniqueness => { :scope => :reply_id }
  validates :reply_id, :presence => true
  validates :vote, :inclusion => { :in => (0..2).to_a }
end
