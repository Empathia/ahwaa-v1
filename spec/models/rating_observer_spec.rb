require 'spec_helper'

describe RatingObserver do
  it "get user and amount of points to update the user score board with" do
    @user  = mock_model(User)
    @reply = mock_model(Reply, :user => @user)
    @rating = mock_model(Rating, :reply => @reply)
    @obs = RatingObserver.instance
    @rating.should_receive(:points_granted).once.and_return(1)
    @user.should_receive(:update_score_board).once.with(1)
    @obs.after_create @rating
  end
end
