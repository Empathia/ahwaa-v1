require 'spec_helper'

describe Admin::TopicRequestsController do
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
      assigns(:topic_requests).should_not be_nil
    end

    context "with created topic requests and users" do

      before(:each) do
        @user_1 = Factory(:user)
        @user_2 = Factory(:user)
        @first_topic_request   = Factory(:topic_request)
        @second_topic_request  = Factory(:topic_request)
      end

      it "should display topics ordered by number of votes" do
        @first_topic_request.vote!(@user_1)
        @second_topic_request.vote!(@user_1)
        @second_topic_request.vote!(@user_2)

        get :index

        assigns(:topic_requests).should == [
          @second_topic_request,
          @first_topic_request
        ]
      end

      it "should allow to create a new topic from a topic request" do
        delete :promote_to_topic, :id => @first_topic_request.id
        lambda { Topic.find(@first_topic_request.id) }.should raise_error(ActiveRecord::RecordNotFound)
        response.should redirect_to(:action => 'new', :controller => 'topics',
                                    :topic => {
                                      :title => @first_topic_request.title,
                                      :content => @first_topic_request.content,
                                      :user_id => @first_topic_request.user_id
                                    })
      end

      it "should destroy a topic" do
        delete :destroy, :id => @first_topic_request.id
        lambda { Topic.find(@first_topic_request.id) }.should raise_error(ActiveRecord::RecordNotFound)
        response.should redirect_to(:action => 'index')
      end
    end
  end
end
