require 'spec_helper'

describe Rating do
  before(:each) do
    @rating = Factory(:rating)
  end

  it { should belong_to(:user) }
  it { should belong_to(:reply) }
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:reply_id) }

  it 'should grant points to rater when voted up' do
    @rating.vote = Rating::VOTE_UP
    @rating.grant_points_to_rater.should == 1 
  end

  it 'should grant points to rater when voted down' do
    @rating.vote = Rating::FLAG
    @rating.grant_points_to_rater.should == 1
  end

  it 'should grant points to rated person when voted up' do
    @rating.vote = Rating::VOTE_UP
    @rating.grant_points_to_rated.should == 10
  end

  it 'should not grant points to rated person when flagged' do
    @rating.vote = Rating::FLAG
    @rating.grant_points_to_rated.should == 0
  end
end
