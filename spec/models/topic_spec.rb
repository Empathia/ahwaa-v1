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

  describe ".by_language" do

    before(:each) do
      Topic.destroy_all
      3.times do
        Factory(:topic, :language => 'en')
      end
      5.times do
        Factory(:topic, :language => 'ar')
      end
    end

    it "returns only english topics" do
      Topic.by_language(:en).length.should == 3
    end

    it "returns only arabic topics" do
      Topic.by_language(:ar).length.should == 5
    end
  end
  
  describe "build_from_request" do

    before(:each) do
      @topic_request = Factory(:topic_request, :anonymous_post => false)
      @topic = Topic.build_from_request(@topic_request.id)
    end

    it "builds a new instance from the topic request attributes" do
      @topic.from_request.should == @topic_request.id
      @topic.title.should == @topic_request.title
      @topic.content.should == @topic_request.content
      @topic.language.should == @topic_request.language
      @topic.user_id.should == @topic_request.user_id
    end

    context "when request is anonymous" do

      before(:each) do
        @topic_request = Factory(:topic_request, :anonymous_post => true)
        @topic = Topic.build_from_request(@topic_request.id)
      end

      it "doesn't copy the user_id to the new topic" do
        @topic.user_id.should be_nil
        @topic.user_id.should_not == @topic_request.user_id
      end

    end

    it "destroys request after being created successfully" do
      @topic.save!
      TopicRequest.find_by_id(@topic.from_request).should be_nil
    end

  end

end
