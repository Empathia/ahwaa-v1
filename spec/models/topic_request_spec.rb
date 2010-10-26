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
  it { should validate_presence_of(:title) }

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

  it "should provide a scope ordered by number of votes descending" do
    user = Factory(:user)
    user1 = Factory(:user)
    user2 = Factory(:user)

    @topic_request1 = Factory(:topic_request)
    @topic_request2 = Factory(:topic_request)
    @topic_request3 = Factory(:topic_request)

    @topic_request.vote!(user)
    @topic_request.vote!(user1)
    @topic_request.vote!(user2)

    @topic_request3.vote!(user1)
    @topic_request3.vote!(user2)

    @topic_request2.vote!(user1)

    TopicRequest.most_voted.should == [@topic_request,
      @topic_request3,
      @topic_request2,
      @topic_request1
    ]
  end

end
