require 'spec_helper'

describe ReplyObserver do
  it "get user and amount of points to update the user score board with" do
    @user  = mock_model(User)
    @reply = mock_model(Reply, :user => @user)
    @obs = ReplyObserver.instance
    @reply.should_receive(:points_granted).once.and_return(1)
    @user.should_receive(:update_score_board).once.with(1)
    @obs.after_create @reply
  end
end
