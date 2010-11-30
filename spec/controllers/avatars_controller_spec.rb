require 'spec_helper'

describe AvatarsController do

  describe "POST 'matches'" do

    before(:each) do
      @user = Factory(:user)
      sign_in @user
    end

    it "get matching avatars" do
      filters = {} 
      Avatar.should_receive(:get_matching_avatars_for_params).with(filters)
      post 'matches', :format => 'js', :filters => filters
      response.should be_success
    end

  end

end
