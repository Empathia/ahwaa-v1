require 'spec_helper'

describe UsersController do
  context "as an un-registered user" do

    it "should not be able to edit his/her user profile" do
      get :show
      response.should redirect_to(root_path)
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
      lambda do
        delete :destroy
      end.should change(User, :count).by(-1)
      response.should redirect_to('/')
    end

  end

end
