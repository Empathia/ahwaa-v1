require 'spec_helper'

describe ReplyObserver do
  it "get user and amount of points to update the user score board with" do
    @topic = mock_model(Topic)
    @user  = mock_model(User)
    @reply = mock_model(Reply, :user => @user, :topic => @topic)
    @obs = ReplyObserver.instance
    @reply.should_receive(:points_granted).once.and_return(1)
    @user.should_receive(:update_score_board).once.with(1)
    @topic.should_receive(:subscribed?).once.with(@user)
    @user.should_receive(:subscribe_to).once.with(@topic)
    StreamMessage.should_receive(:create).once.with(:reply => @reply)
    @topic.should_receive(:notify_subscribers_about_new_response).once.with(@reply)
    @obs.after_create @reply
  end
end
