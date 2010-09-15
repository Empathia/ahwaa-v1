require 'spec_helper'

describe UserProfile do
  before(:each) do
    Factory(:user_profile)
  end

  it { should belong_to(:user) }
end
