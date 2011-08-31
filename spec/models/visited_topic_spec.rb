require 'spec_helper'

describe VisitedTopic do
  before do
    Factory(:visited_topic)
  end

  it { should belong_to(:user) }
  it { should belong_to(:topic) }
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:topic_id) }

  context "no visited topic exists" do

    before do
      @topic = Factory(:topic)
      @user = Factory(:user)
    end

    it "creates a new visited topic" do
      lambda do
        VisitedTopic.visit!(@topic, @user)
      end.should change(VisitedTopic, :count).by(1)
    end

  end

  context "visited topic exists" do

    before do
      @topic = Factory(:topic)
      @user = Factory(:user)
      @visited = Factory(:visited_topic, :topic => @topic, :user => @user)
    end

    it "increments visits for that topic" do
      @visited.visits.should == 1
      VisitedTopic.visit!(@topic, @user)
      @visited.reload.visits.should == 2
    end

  end
end
