require 'spec_helper'

describe Reply do
  before(:each) do
    @reply = Factory(:reply)
  end

  it { should validate_presence_of(:content) }
  it { should validate_presence_of(:topic_id) }
  it { should validate_presence_of(:category) }
  it { should belong_to(:topic) }
  it { should belong_to(:user) }
  it { should belong_to(:parent) }
  it { should have_many(:replies) }
  it { should have_many(:raters).through(:ratings) }

  it "should validate inclusion of category in Reply::CATEGORIES" do
    @reply = Factory.build(:reply, :category => "invalid")
    @reply.should_not be_valid
  end

  context "created by an anonymous user" do
    before(:each) do
      @reply = Factory.build(:reply, :user => nil)
    end

    it "should have an anonymouse user" do
      @reply.anonymous?.should be_true
    end
  end

  it "should inherit topic from parent when replying to a reply" do
    new_reply = Factory.build(:reply, :topic => nil)
    @reply.replies << new_reply
    new_reply.topic.should == @reply.topic
  end
end
