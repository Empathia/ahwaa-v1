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
  it { should have_many(:vote_ups) }
  it { should have_many(:flags) }

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

  it "gets latest replies" do
    sleep 1 # so created_at isn't the same as @reply
    latest = 5.times.map { Factory(:reply) }
    Reply.latest.map(&:id).sort.should == latest.map(&:id).sort
  end

  it "should inherit topic from parent when replying to a reply" do
    new_reply = Factory.build(:reply, :topic => nil)
    @reply.replies << new_reply
    new_reply.topic.should == @reply.topic
  end

  describe 'being rated' do

    context "not yet rated by user" do

      it "votes up" do
        lambda do
          @reply.vote_up!(Factory(:user))
        end.should change(@reply.vote_ups, :size).by(1)
      end

      it "flags" do
        lambda do
          @reply.flag!(Factory(:user))
        end.should change(@reply.flags, :size).by(1)
      end

    end

    context "already rated" do

      before(:each) do
        @user = Factory(:user)
        @reply.vote_up!(@user)
        @reply.flag!(@user)
      end

      it "votes up" do
        @reply.vote_up!(@user)
        @reply.reload.vote_ups.size.should == 1
      end

      it "flags" do
        @reply.flag!(@user)
        @reply.reload.flags.size.should == 1
      end

    end

  end

end
