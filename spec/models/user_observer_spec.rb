require 'spec_helper'

describe UserObserver do
  it "should set initial rewards" do
    @user = mock_model(User)
    @obs = UserObserver.instance
    @user.should_receive(:set_reward).exactly(3).times
    @obs.after_create @user
  end
end
