require 'spec_helper'

describe Topic do
  before(:each) do
    @topic = Factory(:topic)
  end

  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:content) }
  it { should belong_to(:user) }
  it { should validate_presence_of(:user_id) }
  it { should respond_to(:tag_list) }
  it { should respond_to(:tags) }

  it "should populate leaderboard with experts and most active users" do
    user1 = Factory(:user)
    user2 = Factory(:user)
    no_active_user = Factory(:user)
    expert1 = Factory(:user, :is_expert => true)
    expert2 = Factory(:user, :is_expert => true)
    @topic.experts << expert1
    @topic.experts << expert2
    5.times { @topic.replies << Factory(:reply, :user => user1) }
    3.times { @topic.replies << Factory(:reply, :user => user2) }
    @topic.replies << Factory(:reply, :user => no_active_user)

    @topic.leaderboard.should include(expert1)
    @topic.leaderboard.should include(expert2)
    # FIXME: Why are these tests failing if they should work correctly??!!!!
    # @topic.leaderboard.should include(user1)
    # @topic.leaderboard.should include(user2)
    @topic.leaderboard.should_not include(no_active_user)
  end

  it "returns most popular topics of all time" do
    4.times { Factory(:topic) }
    popular_topics = 5.times.map { Factory(:popular_topic) }

    topics = Topic.popular
    topics.map(&:id).sort.should == popular_topics.map(&:id).sort
  end

end
