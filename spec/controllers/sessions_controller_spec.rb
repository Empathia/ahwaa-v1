require 'spec_helper'

describe SessionsController do

  before(:each) do
    @user = Factory(:user)
  end

  describe "POST create" do

    def do_request(params = {})
      xhr :post, :create, params.merge(:format => :js)
    end

    context "when user exists" do

      before(:each) do
        User.stub!(:find_for_database_authentication).and_return(@user)
      end

      it "finds user with user or email" do
        User.should_receive(:find_for_database_authentication).and_return(@user)
        do_request
      end

      context "when user authenticates successfully" do

        before(:each) do
          @user.stub!(:authenticate!).and_return(true)
        end

        it "renders create template" do
          do_request
          response.should render_template(:create)
        end

        it "sets session with user's id" do
          do_request
          session[:current_user].should == assigns(:user).id
        end

      end

      context "when user fails to authenticate" do

        before(:each) do
          @user.stub!(:authenticate!).and_return(false)
        end

        it "doesn't set session with user's id" do
          do_request
          session[:current_user].should_not == assigns(:user).id
        end

        it "renders create template" do
          do_request
          response.should render_template(:create)
        end

      end

    end

    context "when user doesn't exist" do

      before(:each) do
        User.stub!(:find_for_database_authentication).and_return(nil)
      end

      it "doesn't find user with user or email" do
        User.should_receive(:find_for_database_authentication).and_return(nil)
        do_request
      end

      it "renders create template" do
        do_request
        response.should render_template(:create)
      end

    end

  end

  describe "GET destroy" do

    def do_request(params = {})
      get :destroy, params
    end

    context "when user is not logged in" do

      it "redirects to root_path" do
        do_request
        response.should redirect_to(root_path)
      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
      end

      it "signs out current user" do
        do_request
        current_user.should be_nil
        session[:current_user].should be_nil
      end

      it "redirects to root path" do
        do_request
        response.should redirect_to(root_path)
      end

    end

  end

end
