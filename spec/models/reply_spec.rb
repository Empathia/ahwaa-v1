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
  
  it "should grant points if created correctly" do
    @reply.points_granted.should == 5
  end

  it 'should increment user score board points after being created' do
    ActiveRecord::Observer.with_observers(:user_observer, :reply_observer) do
      @reply = Factory(:reply)
      @user = @reply.user
      @score_board = @user.score_board
    end
    @score_board.current_points.should == Reply::POINTS_FOR_POSTING
  end

  context "created by an anonymous user" do

    before(:each) do
      @reply = Factory.build(:reply, :user => nil)
    end

    it "should have an anonymouse user" do
      @reply.anonymous?.should be_true
    end

    it "should not grant any points" do
      @reply.points_granted.should == 0
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

    it "knows if a user has already voted" do
      @user = Factory(:user)
      @reply.voted_by?(@user).should be_false
      @reply.vote_up!(@user)
      @reply.voted_by?(@user).should be_true

      @reply.flagged_by?(@user).should be_false
      @reply.flag!(@user)
      @reply.flagged_by?(@user).should be_true
    end

    context "gets marked as useful" do

      it "with positive votes only" do
        @reply.vote_up!(Factory(:user))
        @reply.useful?.should be_true
      end

      it "with more positive votes than negatives" do
        @reply.vote_up!(Factory(:user))
        @reply.vote_up!(Factory(:user))
        @reply.flag!(Factory(:user))
        @reply.useful?.should be_true
      end

      it "should increase the users current points when voted up" do
        ActiveRecord::Observer.with_observers(:user_observer, :rating_observer) do
          @rater = Factory(:user)
          @reply = Factory(:reply)
          @reply.vote_up!(@rater)
        end
        @reply.reload.user.score_board.current_points.should == Rating::VOTE_UP
        @rater.score_board.current_points.should == Rating::POINTS_FOR_RATING 
      end

    end

    context "gets marked as not useful" do

      it "with only negative votes" do
        @reply.flag!(Factory(:user))
        @reply.useful?.should be_false
      end

      it "with equals negative and positive votes" do
        @reply.vote_up!(Factory(:user))
        @reply.flag!(Factory(:user))
        @reply.useful?.should be_false
      end

      it "with more negatives than positive votes" do
        @reply.flag!(Factory(:user))
        @reply.flag!(Factory(:user))
        @reply.vote_up!(Factory(:user))
        @reply.useful?.should be_false
      end

    end

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
