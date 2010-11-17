require 'spec_helper'

describe Reward do

  before(:each) do 
    @reward = Factory(:reward)
  end

  it { should validate_presence_of(:type) }
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:description) }
  it { should validate_presence_of(:amount_points_of_required) }
end

describe Level do
  
  before(:each) do
    @prize = Factory(:level)
  end

  it { should have_many(:score_boards) }
  it { should have_many(:users).through(:score_boards) }

end
