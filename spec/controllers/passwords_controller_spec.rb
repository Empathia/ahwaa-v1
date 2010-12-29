require 'spec_helper'

describe PasswordsController do
  before(:each) do
    @user = Factory(:user)
  end

  describe "POST create" do
    
    def do_request(params = {})
      xhr :post, :create, params.merge(:format => :js)
    end

    it "should try to find user with email or username" do
      User.stub!(:find_for_database_authentication)
      User.should_receive(:find_for_database_authentication)
      do_request
    end

    context "when user is found" do

      before(:each) do
        User.stub!(:find_for_database_authentication).and_return(@user)
        @user.stub!(:notify_password_reset!)
      end

      it "should send password reset link by email" do
        @user.should_receive(:notify_password_reset!)
        do_request
      end

    end

    context "when user is not found" do

      before(:each) do
        User.stub!(:find_for_database_authentication).and_return(nil)
        @user.stub!(:reset_single_access_token!)
      end

      it "should not send password reset link by email" do
        @user.should_not_receive(:notify_password_reset!)
        do_request
      end

      it "should not reset single access token" do
        @user.should_not_receive(:reset_single_access_token!)
        do_request
      end

    end

  end

  describe "GET edit" do

    def do_request(params = {})
      get :edit, params
    end

    before(:each) do
      User.stub!(:find_by_single_access_token!).and_return(@user)
    end

    it "finds user by single access token" do
      User.should_receive(:find_by_single_access_token!).and_return(@user)
      do_request :id => 1
    end

    it "renders form to edit user's password" do
      do_request :id => 1
      response.should render_template(:edit)
    end

  end

  describe "PUT update" do

    def do_request(params = {})
      put :update, params
    end

    before(:each) do
      User.stub!(:find_by_single_access_token!).and_return(@user)
      @user.stub!(:reset_single_access_token!)
      @user.stub!(:update_attribute).and_return(true)
    end

    it "finds user by single access token" do
      User.should_receive(:find_by_single_access_token!).and_return(@user)
      do_request :id => 1
    end

    it "resets single access token for user" do
      @user.should_receive(:reset_single_access_token!)
      do_request :id => 1
    end

    it "changes password from params" do
      @user.should_receive(:update_attribute).and_return(true)
      do_request :id => 1
    end

    it "redirects to root path" do
      do_request :id => 1
      response.should redirect_to(root_path)
    end

  end

end
