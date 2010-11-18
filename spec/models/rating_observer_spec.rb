require 'spec_helper'

describe RatingObserver do
  it "get user and amount of points to update the user score board with" do
    @user  = mock_model(User)
    @reply = mock_model(Reply, :user => @user)
    @rating = mock_model(Rating, :reply => @reply, :user => @user)
    @obs = RatingObserver.instance
    @rating.should_receive(:grant_points_to_rated).once.and_return(1)
    @rating.should_receive(:grant_points_to_rater).once.and_return(1)
    @user.should_receive(:update_score_board).twice.with(1)
    @obs.after_create @rating
  end
end
