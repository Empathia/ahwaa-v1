require 'spec_helper'

describe PasswordsController do
  before(:each) do
    @user = Factory(:user)
  end

  describe "POST create" do
    
    def do_request(params = {})
      xhr :post, :create, params.merge(:format => :json)
    end

    it "should try to find user with email or username" do
      User.stub!(:find_for_database_authentication)
      User.should_receive(:find_for_database_authentication)
      do_request
    end

    context "when user is found" do

      before(:each) do
        User.stub!(:find_for_database_authentication).and_return(@user)
        UserMailer.stub_chain(:password_reset, :deliver)
        @user.stub!(:reset_single_access_token!).and_return(true)
      end

      it "should send password reset link by email" do
        UserMailer.password_reset(@user).should_receive(:deliver)
        do_request
      end

      it "should reset single access token" do
        @user.should_receive(:reset_single_access_token!).and_return(true)
        do_request
      end

      it "responds with status 201" do
        do_request
        response.status.should == 201
      end

    end

    context "when user is not found" do

      before(:each) do
        User.stub!(:find_for_database_authentication).and_return(nil)
        UserMailer.stub_chain(:password_reset, :deliver)
        @user.stub!(:reset_single_access_token!)
      end

      it "should not send password reset link by email" do
        UserMailer.password_reset(@user).should_not_receive(:deliver)
        do_request
      end

      it "should not reset single access token" do
        @user.should_not_receive(:reset_single_access_token!)
        do_request
      end

      it "responds with status 404" do
        do_request
        response.status.should == 404
      end

    end

  end

end
