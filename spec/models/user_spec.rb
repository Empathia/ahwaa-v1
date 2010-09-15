require 'spec_helper'

describe User do
  before(:each) do
    @user = Factory(:user)
  end

  it { should validate_uniqueness_of(:username) }
  it { should validate_uniqueness_of(:email) }
  it { should validate_presence_of(:password) }
  it { should_not allow_mass_assignment_of(:encrypted_password) }
  it { should_not allow_mass_assignment_of(:password_salt) }
  it { should_not allow_mass_assignment_of(:responses_count) }
  it { should_not allow_mass_assignment_of(:is_expert) }
  it { should_not allow_mass_assignment_of(:is_admin) }

  ['bademail', 'bad@email', 'bad @email', 'bad.email', 'bad$%@email.com', '@bademail',
    '@bademail.com', 'bad@$#$.com', 'bad@@email.com'].each do |email|
    it { should_not allow_value(email).for(:email) }
  end

  context "upon creation" do
    
    it "should have a profile" do
      @user.profile.should_not be_nil
    end

    it "should not be expert nor admin" do
      @user.is_expert?.should_not be_true
      @user.is_admin?.should_not be_true
    end

  end
end

