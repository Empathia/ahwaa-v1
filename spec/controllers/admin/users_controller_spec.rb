require 'spec_helper'

describe Admin::UsersController do

  include Devise::TestHelpers
  
  it 'should deny acces to regular users' do
    sign_in Factory(:user)
    get :index
    response.should be_redirect
  end
  
  context "as an admin user" do
    
    before(:each) do
      @admin_user = Factory(:admin)
      sign_in @admin_user
    end
    
    it 'should grant acces' do 
      get :index
      
      assigns(:users)
    end
    
    it "should be able to toggle a user as an expert" do
      put :toggle_expert, :id => @admin_user.id
      @admin_user.reload.is_expert.should == true
      put :toggle_expert, :id => @admin_user.id
      @admin_user.reload.is_expert.should == false
    end
    
  end

end