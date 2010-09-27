require 'spec_helper'

describe Avatar do

  before(:each) do
    Factory(:avatar)
  end

  it { should have_many(:user_profiles) }

end
