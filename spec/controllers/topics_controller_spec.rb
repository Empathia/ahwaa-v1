require 'spec_helper'

describe TopicsController do
  include Devise::TestHelpers

  before(:each) do
    @topic = Factory(:topic)
  end

  it "should grant access to guest users" do
    get :show, :id => @topic.id
    assigns(:topic).should == @topic
    response.should_not be_redirect
  end
end
