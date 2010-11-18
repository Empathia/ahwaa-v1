require 'spec_helper'

describe ScoreBoard do

  before(:each) do 
    @score_board = Factory(:score_board)
  end

  it { should belong_to(:user) }
  it { should belong_to(:level) }
  it { should belong_to(:badge) }
  it { should belong_to(:prize) }
  it { should validate_presence_of(:user_id) }
  it { should validate_numericality_of(:current_points) }

end
