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
        current_user.stub!(:private_messages).and_return(@private_messages = PrivateMessage.scoped)
      end

      it "render index template" do
        do_request
        response.should render_template(:index)
      end

      it "should get all private messages of current user" do
        current_user.should_receive(:private_messages).and_return(@private_messages)
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
        @private_message = Factory(:private_message)
        current_user.stub_chain(:private_messages, :find).and_return(@private_message)
        @private_message.stub!(:read!)
      end

      it "render show template" do
        do_request :id => 1
        response.should render_template(:show)
      end

      it "should find a private message of the current user" do
        current_user.private_messages.should_receive(:find).and_return(@private_message)
        do_request :id => 1
      end

      it "should mark message as read" do
        @private_message.should_receive(:read!)
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
        @private_message.should_receive(:sender=).with(current_user).and_return(current_user)
        @private_message.should_receive(:save).and_return(true)
        do_request
      end

      context "when messages saves successfully" do

        before(:each) do
          @private_message.stub!(:save).and_return(true)
          UserMailer.stub_chain(:private_message_notification, :deliver)
        end

        it "sends an email to the recipient" do
          UserMailer.private_message_notification(any_args).should_receive(:deliver)
          do_request
        end

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
        @private_message = Factory(:private_message)
        current_user.stub_chain(:private_messages, :find).and_return(@private_message)
        @private_message.stub!(:destroy).and_return(true)
      end

      it "deletes private message of current user" do
        current_user.private_messages.should_receive(:find).and_return(@private_message)
        @private_message.should_receive(:destroy).and_return(true)
        do_request :id => 1
      end

      it "redirects to index action" do
        do_request :id => 1
        response.should redirect_to(user_path)
      end

    end

  end

end

