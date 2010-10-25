require 'spec_helper'

describe SearchController do

  describe "Search 'topics'" do
    it "should return JSON" do
      @topic = Factory(:topic)
      Topic.stub(:search_tank) {@topic.to_json}

      get 'topics', :format => :json
      assigns(:results).should == @topic.to_json
      response.should be_success
    end
  end

end
