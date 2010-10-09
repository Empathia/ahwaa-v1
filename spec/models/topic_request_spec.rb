require 'spec_helper'

describe TopicRequest do

  before(:each) do
    @topic_request = Factory(:topic_request)
  end

  it { should have_many(:topic_request_votes) }
  it { should have_many(:users).through(:topic_request_votes) }

  it { should validate_presence_of(:title) }
  it { should belong_to(:user) }
  it { should validate_presence_of(:user_id) }

  it "should be able to cast vote" do
    @topic_request.vote!(Factory(:user))
    @topic_request.votes.should == 1
  end

  it "should not cast more than one vote per user" do
    user = Factory(:user)
    @topic_request.vote!(user)
    @topic_request.vote!(user)
    @topic_request.votes.should == 1
    TopicRequestVote.all.count.should == 1
  end

end
