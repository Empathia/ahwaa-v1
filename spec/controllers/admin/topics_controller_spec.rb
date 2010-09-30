require 'spec_helper'

describe Admin::TopicsController do
  include Devise::TestHelpers

  it "should deny access to regular users" do
    sign_in Factory(:user)
    get :index
    response.should be_redirect
  end

  context "as a signed in admin user" do

    before(:each) do
      @admin = Factory(:admin)
      sign_in @admin
    end

    it "should grant access" do
      get :index
      assigns(:topics).should_not be_nil
    end

    it "should allow to create a topic" do
      get :new
      assigns(:topic).new_record?.should be_true
    end

    it "should create a topic" do
      post :create, :topic => {:title => "This is my topic for tests",
        :content => "Lorem Ipsum dolor?", :user => Factory(:user)}
      assigns(:topic).new_record?.should be_false
      response.should be_redirect
    end

    context "with created topic" do
      before(:each) do
        @topic = Factory(:topic)
      end

      it "should allow to edit a topic" do
        get :edit, :id => @topic.id
        assigns(:topic).should == @topic
      end
      
      it "should update a topic" do
        new_title = "Updating title!!!"
        put :update, :id => @topic.id, :topic => {:title => new_title}
        assigns(:topic).title.should == new_title
        response.should be_redirect
      end

      it "should destroy a topic" do
        delete :destroy, :id => @topic.id
        lambda { Topic.find(@topic.id) }.should raise_error(ActiveRecord::RecordNotFound)
        response.should be_redirect
      end

    end

  end
end
