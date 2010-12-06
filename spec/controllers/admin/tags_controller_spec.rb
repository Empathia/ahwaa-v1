require 'spec_helper'

describe Admin::TagsController do

  it "should deny access to regular users" do
    sign_in Factory(:user)
    get :index 
    response.should be_redirect
  end

  describe "GET 'index' with authorized admin" do
  
    before(:each) do
      @admin = Factory(:admin)
      sign_in @admin
    end

    it "should be successful" do
      get 'index', :format => 'json'
      response.should be_success
    end
  end

end
