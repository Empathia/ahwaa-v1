require 'spec_helper'

describe Avatar do

  before(:each) do
    Factory(:avatar)
  end

  it { should have_many(:user_profiles) }
  it { should validate_presence_of(:url) }

end
