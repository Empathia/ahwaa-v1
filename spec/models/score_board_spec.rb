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

  context 'when the current points amount changes' do
    before(:each) do
      @user = Factory(:user)
      @user.score_board = @score_board
    end

    it 'should change the level if the points match x amount' do
      @level = Factory(:level, :amount_points_of_required => 2)
      lambda do
        @user.update_score_board(2)
      end.should change(@score_board.reload, :level).from(nil).to(@level)
    end
  end
end
