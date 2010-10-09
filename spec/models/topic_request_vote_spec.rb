require 'spec_helper'

describe TopicRequestVote do

  before(:each) do
    @topic_request_vote = Factory(:topic_request_vote)
  end

  it { should belong_to(:topic_request) }
  it { should belong_to(:user) }
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:topic_request_id) }

end
