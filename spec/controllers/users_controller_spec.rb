require 'spec_helper'

describe UsersController do

  include Devise::TestHelpers

  context "as an un-registered user" do

    it "should not be able to edit his/her user profile" do
      get :show
      response.should redirect_to(:controller => 'devise/sessions' ,:action => 'new')
    end

  end

  context "as a registered user" do

    before(:each) do
      @user = Factory(:user)
      sign_in @user
    end

    it "should let the user edit his/her own profile" do
      get :show
      response.should be_succes
    end

    it "should show the user the profile page" do
      get :show
      response.should be_succes
    end

    it "should let the user edit his/her own profile" do
      put  :update, :user => { :profile => {:gender => 'male', :language => 'en'}}
      response.should redirect_to(:action => 'show')
      @user.reload.profile.gender == 'male'
      @user.reload.profile.language == 'en'
    end

    it "should let the user delete his/her own profile" do
      delete :destroy
      response.should redirect_to('/')
      User.count.should eql(0)
    end

  end

end
