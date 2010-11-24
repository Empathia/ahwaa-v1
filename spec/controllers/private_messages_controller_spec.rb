require 'spec_helper'

describe PrivateMessagesController do

  before(:each) do
    @user = Factory(:user)
  end

  describe 'GET index' do

    def do_request(params = {})
      xhr :get, :index, params.merge(:format => :js)
    end

    context "when user isn't logged in" do

      it "doesn't render index template" do
        do_request
        response.should_not render_template(:index)
      end

    end

    context "when the user is logged in" do

      before(:each) do
        sign_in @user
        current_user.stub!(:received_messages).and_return(@private_messages = ReceivedMessage.scoped)
      end

      it "render index template" do
        do_request
        response.should render_template(:index)
      end

      it "should get all private messages of current user" do
        current_user.should_receive(:received_messages).and_return(@private_messages)
        do_request
      end

    end

  end

  describe 'GET show' do

    def do_request(params = {})
      xhr :get, :show, params.merge(:format => :js)
    end

    context "when user isn't logged in" do

      it "doesn't render show template" do
        do_request :id => 1
        response.should_not render_template(:show)
      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
        @conversation = Factory(:private_message)
        current_user.stub_chain(:received_messages, :find, :conversation).and_return(@conversation)
        @conversation.stub!(:read_for!).with(current_user)
      end

      it "render show template" do
        do_request :id => 1
        response.should render_template(:show)
      end

      it "should find a private message of the current user" do
        current_user.received_messages.find(any_args).should_receive(:conversation).and_return(@conversation)
        do_request :id => 1
      end

      it "should mark message as read" do
        @conversation.should_receive(:read_for!).with(current_user)
        do_request :id => 1
      end

    end

  end

  describe 'POST create' do

    def do_request(params = {})
      xhr :post, :create, params.merge(:user_id => 1, :format => :js)
    end

    context "when user isn't logged in" do

      it "doesn't render create template" do
        do_request
        response.should_not render_template(:create)
      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
        @private_message = Factory.build :private_message
        PrivateMessage.stub!(:build_from_params).with(any_args).and_return(@private_message)
      end

      it "creates a new private message" do
        PrivateMessage.should_receive(:build_from_params).with(any_args).and_return(@private_message)
        @private_message.should_receive(:save).and_return(true)
        do_request
      end

      it "sets current user as the sender of the message" do
        @private_message.should_receive(:save).and_return(true)
        do_request
      end

    end

  end

  describe "DELETE destroy" do

    def do_request(params = {})
      delete :destroy, params
    end

    context "when user isn't logged in" do

      it "doesn't redirects to destroy action" do
        do_request :id => 1
        response.should_not redirect_to(:action => :destroy)
      end

      it "redirects to login path" do
        do_request :id => 1
        response.should redirect_to(root_path)
      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
        @conversation = Factory(:private_message)
        current_user.stub_chain(:received_messages, :find, :conversation).and_return(@conversation)
        @conversation.stub!(:received_messages_thread).with(current_user).and_return([])
      end

      it "deletes received messages of current user" do
        current_user.received_messages.find(any_args).should_receive(:conversation).and_return(@conversation)
        @conversation.received_messages_thread(current_user).should_receive(:each)
        do_request :id => 1
      end

      it "redirects to users' profile action" do
        do_request :id => 1
        response.should redirect_to(user_path)
      end

    end

  end

end

