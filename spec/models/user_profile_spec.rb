require 'spec_helper'

describe UserProfile do
  before(:each) do
    @profile = Factory(:user_profile)
  end

  it { should belong_to(:user) }
  it { should belong_to(:avatar) }
  it { should validate_presence_of(:language) }
  it { should allow_value('en').for(:language) }
  it { should allow_value('ar').for(:language) }
  it { should_not allow_value('es').for(:language) }

  it "should build a default avatar if none is choosen" do
    @profile.avatar.should_not be_nil
    @profile.avatar.url.should == Avatar.default.url
  end

end
