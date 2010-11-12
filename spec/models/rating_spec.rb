require 'spec_helper'

describe Rating do
  before(:each) do
    @rating = Factory(:rating)
  end

  it { should belong_to(:user) }
  it { should belong_to(:reply) }
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:reply_id) }
end
