require 'spec_helper'

describe UserSessionsController do

  it "should render the login form" do
    get 'new'
    should render_template(:new)
  end

  it "should create a user session" do
    @user = Factory(:user, :username => "foobar", :password => "123456")
    post 'create', :username => @user.username, :password => @user.password
    current_user.should == @user
    flash[:notice].should_not be_nil
    response.should be_redirect
  end

  it "should not authenticate user if there is no such user" do
    post 'create', :username => "unexisting_user", :password => ""
    current_user.should be_nil
    flash[:alert].should_not be_nil
    response.should render_template(:new)
  end

  it "should not authenticate user if incorrect" do
    @user = Factory(:user, :username => "pepepancho", :password => "123456")
    post 'create', :username => "pepepancho", :password => "asdasd"
    current_user.should be_nil
    flash[:alert].should_not be_nil
    response.should render_template(:new)
  end

  it "should logout current user" do
    @user = Factory(:user, :password => "123456")
    post 'create', :username => @user.username, :password => "123456"

    get 'destroy'
    current_user.should be_nil
    response.should be_redirect
  end
end
