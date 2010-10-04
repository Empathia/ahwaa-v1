require 'spec_helper'

describe Rating do
  before(:each) do
    @rating = Factory(:rating)
  end

  it { should belong_to(:user) }
  it { should belong_to(:reply) }
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:reply_id) }
  it { should validate_uniqueness_of(:user_id).scoped_to(:reply_id) }
  it { should ensure_inclusion_of(:vote).in_range(0..2) }
end
