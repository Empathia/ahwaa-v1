require 'spec_helper'

describe PrivateMessagesController do
  include Devise::TestHelpers

  before(:each) do
    @sender = Factory(:user)
    @recipient = Factory(:user)
    sign_in @recipient
  end

  context "listing income messages" do
    before(:each) do
      10.times do
        Factory(:private_message, :recipient => current_user, :unread => false)
      end
    end

    it "should show all user's received messages" do
      get :index
      assigns(:private_messages).should_not be_nil
      assigns(:private_messages).length.should == 10
    end

    it "should sort messages by date" do
      sleep(1) # so created_at vary 1 sec
      unread_pm = Factory(:private_message, :recipient => current_user)

      get :index
      assigns(:private_messages).first.should == unread_pm
    end

    it "should group all messages by thread" do
      create_thread
      get :index
      assigns(:private_messages).length.should == 11
    end
  end

  context "posting with xhr" do
    it "should respond with json" do
      post_with_xhr
      response.status.should == 201
      response.should_not be_redirect
      response.body.should == assigns(:private_message).to_json
    end

    context "posting invalid pm" do
      it "should respond with proper error code" do
        post_with_xhr(:private_message => Factory.build(:private_message, :sender => nil, :recipient => nil, :content => nil).attributes)
        assigns(:private_message).should_not be_valid
        response.status.should == 422
        response.body.should == assigns(:private_message).errors.to_json
      end
    end

    it "should create a private message" do
      lambda do
        post_with_xhr
      end.should change(PrivateMessage, :count).by(1)
      assigns(:private_message).should_not be_nil
      assigns(:private_message).new_record?.should be_false
    end

    it "should create a conversation if replying to a private message" do
      create_thread
      lambda do
        post_with_xhr :reply_to => @pm.id, :user_id => @sender.id
      end.should change(PrivateMessage, :count).by(1)
      assigns(:private_message).parent.should == @pm
    end

    it "should not create a conversation if replying to an invalid parent" do
      create_thread
      parent = Factory(:private_message)
      lambda do
        post_with_xhr :reply_to => parent.id, :user_id => @sender.id
      end.should_not change(PrivateMessage, :count)
      response.status.should == 422
    end
  end

  it "should show the conversation of each private message" do
    create_thread
    get :show, :id => @pm.id
    assigns(:private_message).should == @pm
    response.should render_template(:show)
  end

  it "should destroy a conversation" do
    create_thread
    lambda do
      delete :destroy, :id => @pm.id
    end.should change(PrivateMessage, :count).by(-6)
    assigns(:private_message).should == @pm
    lambda do
      current_user.private_messages.find(@pm.id)
    end.should raise_error(ActiveRecord::RecordNotFound)
  end

  def post_with_xhr(attrs = {})
    attrs.reverse_merge!({
      :user_id => Factory(:user).id,
      :private_message => Factory.build(:private_message, :recipient => nil, :sender => nil).attributes
    })
    xhr :post, :create, attrs.merge(:format => :json)
  end

  def switch_recipient
    sender = current_user
    sign_out current_user
    if sender == @recipient
      recipient = @recipient
      sign_in @sender
    else
      recipient = @sender
      sign_in @recipient
    end
    recipient
  end

  def create_thread
    @pm = Factory(:private_message, :recipient => current_user, :sender => @sender)
    5.times do |i|
      reply = Factory.build(:private_message, :recipient => nil, :sender => nil)
      post_with_xhr :private_message => reply.attributes,
        :reply_to => @pm.id, :user_id => switch_recipient.id
      response.status.should == 201
      assigns(:private_message).parent.should == @pm
      assigns(:private_message).read!
    end
    @pm.replies.length.should == 5

    sign_out current_user
    sign_in @recipient
  end
end

