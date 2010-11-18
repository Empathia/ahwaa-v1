require 'spec_helper'

describe UserObserver do
  it "should set initial rewards" do
    @level = mock_model(Level)
    Level.stub!(:first).and_return @level
    Badge.stub!(:first).and_return @level
    Prize.stub!(:first).and_return @level
    @user = mock_model(User)
    @obs = UserObserver.instance
    @user.should_receive(:set_reward).exactly(3).times
    @obs.after_create @user
  end
end
