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
        response.should redirect_to(root_path)
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

    it "should deliver sign up confirmation" do
      UserMailer.stub_chain(:sign_up_confirmation, :deliver)
      UserMailer.sign_up_confirmation(@user).should_receive(:deliver)
      do_request
    end

  end

  describe "PUT update" do

    def do_request(params = {})
      xhr :put, :update, {:user => {}}.merge(params.merge(:format => :js))
    end

    context "when user isn't logged in" do

      it "doesn't render update template" do
        do_request
        response.should_not render_template(:update)
      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
        current_user.stub!(:update_attributes).and_return(true)
      end

      it "renders js template" do
        do_request
        response.should render_template(:update)
      end

      it "updates attributes for user" do
        current_user.should_receive(:update_attributes).and_return(true)
        do_request
      end

      context "when submitting profile form" do

        before(:each) do
          do_request :user => { :profile_attributes => { :religion_id => 1 } }
        end

        it "assigns submitted_form to profile" do
          assigns(:submitted_form).should == 'profile'
        end

      end

      context "when submitting password form" do

        before(:each) do
          do_request :user => { :password => 'asdasd' }
        end

        it "assigns submitted_form to password" do
          assigns(:submitted_form).should == 'password'
        end

      end

      context "when submitting account form" do

        before(:each) do
          do_request :user => { :user => { :email => 'new@example.com' } }
        end

        it "assigns submitted_form to account" do
          assigns(:submitted_form).should == 'account'
        end

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
        response.should redirect_to(root_path)
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
