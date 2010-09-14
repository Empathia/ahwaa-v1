require 'spec_helper'

describe User do
  before(:each) do
    Factory(:user)
  end

  it { should validate_uniqueness_of(:username) }
  it { should validate_uniqueness_of(:email) }
  it { should validate_presence_of(:password) }
  it { should validate_presence_of(:password_confirmation) }
  it { should_not allow_mass_assignment_of(:encrypted_password) }
  it { should_not allow_mass_assignment_of(:password_salt) }
  it { should_not allow_mass_assignment_of(:responses_count) }
end

