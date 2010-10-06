require 'spec_helper'

describe RepliesController do
  include Devise::TestHelpers

  before(:each) do
    @topic = Factory(:topic)
  end

  context "requesting with xhr" do
    it "should respond with json" do
      post_with_xhr
      response.status.should == 201
      response.should_not be_redirect
      response.body.should == assigns(:reply).to_json
    end

    context "posting invalid reply" do
      it "should respond with proper error code" do
        post_with_xhr(:reply => Factory.build(:reply, :content => nil).attributes)
        assigns(:reply).should_not be_valid
        response.status.should == 422
        response.body.should == assigns(:reply).errors.to_json
      end
    end
  end

  context "requesting with http" do
    it "should respond with html" do
      post_with_http
      flash[:notice].should_not be_blank
      response.should redirect_to(topic_path(@topic))
    end

    context "posting invalid reply" do
      it "should redirect to topic page" do
        post_with_http(:reply => Factory.build(:reply, :content => nil).attributes)
        response.should redirect_to(topic_path(@topic))
        assigns(:reply).should_not be_valid
        flash[:alert].should_not be_blank
      end
    end
  end

  context "as a logged in user" do
    before(:each) do
      sign_in Factory(:user)
    end

    it "should create a reply" do
      create_reply
      assigns(:reply).anonymous?.should be_false
      assigns(:reply).user.should == current_user
    end
  end

  context "as an anonymouse user" do
    
    it "should create an anonymouse reply" do
      create_reply
      assigns(:reply).anonymous?.should be_true
    end

  end

  def post_with_xhr(attrs = {})
    attrs.reverse_merge!({
      :topic_id => @topic.id,
      :reply => Factory.build(:reply, :user => nil).attributes
    })
    xhr :post, :create, attrs.merge(:format => :json)
  end

  def post_with_http(attrs = {})
    attrs.reverse_merge!({
      :topic_id => @topic.id,
      :reply => Factory.build(:reply, :user => nil).attributes
    })
    post :create, attrs
  end

  def create_reply
    lambda do
      post_with_xhr
    end.should change(Reply, :count).by(1)
    assigns(:reply).new_record?.should be_false
    assigns(:reply).topic.should == @topic
  end
end

