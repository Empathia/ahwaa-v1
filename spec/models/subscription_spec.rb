require 'spec_helper'

describe Subscription do

  before do
    @subscription = Factory(:subscription)
  end

  it { should belong_to(:user) }
  it { should belong_to(:topic) }
  it { should validate_presence_of(:topic_id) }
  it { should validate_presence_of(:user_id) }
  it { should validate_uniqueness_of(:topic_id).scoped_to(:user_id) }

  context "upon creation" do

    it "generates hash_key based on topic_id and user's email" do
      @subscription.hash_key.should_not be_nil
    end

  end

end
