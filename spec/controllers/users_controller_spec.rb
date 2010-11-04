require 'spec_helper'

describe UsersController do

  before(:each) do
    @user = Factory(:user)
  end

  describe "GET show" do

    def do_request(params = {})
      get :show, params
    end

    context "when user isn't logged in" do

      it "doesn't render show template" do
        do_request
        response.should_not render_template(:show)
      end

      it "redirects to login path" do
        do_request
        response.should redirect_to(login_path)
      end

    end

    context "when user is logged in" do
      
      before(:each) do
        sign_in @user
      end

      it "renders show template" do
        do_request
        response.should render_template(:show)
      end

    end

  end

  describe "POST create" do

    def do_request(params = {})
      xhr :post, :create, params.merge(:format => :json)
    end

    before(:each) do
      @user = Factory(:user)
      User.stub!(:new).and_return(@user)
      @user.stub!(:save).and_return(true)
    end

    it "responds with status 201" do
      do_request
      response.status.should == 201
    end

    it "should be logged in" do
      do_request
      assigns(:user).id.should == session[:current_user]
    end

  end

  describe "PUT update" do

    def do_request(params = {})
      put :update, params
    end

    context "when user isn't logged in" do

      it "doesn't redirect to update action" do
        do_request
        response.should_not redirect_to(:action => :update)
      end

      it "redirects to login path" do
        do_request
        response.should redirect_to(login_path)
      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
        current_user.stub!(:update_attributes).and_return(true)
      end

      it "redirects to show action" do
        do_request
        response.should redirect_to(:action => :show)
      end

      it "updates attributes for user" do
        current_user.should_receive(:update_attributes).and_return(true)
        do_request
      end

    end

  end

  describe "DELETE destroy" do

    def do_request(params = {})
      delete :destroy, params
    end

    context "when user isn't logged in" do
      
      it "doesn't redirect to update action" do
        do_request
        response.should_not redirect_to(:action => :update)
      end

      it "redirects to login path" do
        do_request
        response.should redirect_to(login_path)
      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
        @user = current_user
        @user.stub!(:destroy).and_return(true)
      end

      it "signs out current user" do
        do_request
        current_user.should be_nil
      end

      it "destroys user" do
        @user.should_receive(:destroy).and_return(true)
        do_request
      end

      it "redirects to root path" do
        do_request
        response.should redirect_to(root_path)
      end
    end
  end
end
