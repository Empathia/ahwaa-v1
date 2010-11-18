require 'spec_helper'

describe RepliesController do

  before(:each) do
    @user = Factory(:user)
    @topic = Factory(:topic)
    Topic.stub!(:find).and_return(@topic)
  end

  describe 'POST create' do

    before(:each) do
      @reply = Factory.build :reply
      @topic.stub_chain(:replies, :build).and_return(@reply)
    end

    def do_request(params = {})
      xhr :post, :create, params.merge(:topic_id => @topic.id, :format => :js)
    end

    context "when user isn't logged in" do

      it "creates a new reply for the topic without author" do
        @topic.replies.should_receive(:build).and_return(@reply)
        @reply.should_not_receive(:user=)
        do_request
      end

      context "when reply saves successfully" do

        before(:each) do
          @reply.stub!(:save).and_return(true)
        end

        it "creates a new reply for the topic" do
          @reply.should_receive(:save).and_return(true)
          do_request
        end

      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
      end

      it "creates a new reply for the topic with author" do
        @topic.replies.should_receive(:build).and_return(@reply)
        @reply.should_receive(:user=).with(current_user)
        do_request
      end

      context "when reply saves successfully" do

        before(:each) do
          @reply.stub!(:save).and_return(true)
        end

        it "creates a new reply for the topic" do
          @reply.should_receive(:save).and_return(true)
          do_request
        end

      end

    end

  end

  describe "POST flag" do

    before(:each) do
      @reply = Factory(:reply)
    end

    def do_request(params = {})
      xhr :post, :flag, params.merge(:topic_id => @topic.id, :format => :json)
    end

    context "when user is not logged in" do

      it "responds with status 401" do
        do_request :reply_id => 1
        response.status.should == 401
      end

      it "doesn't get flagged" do
        @reply.should_not_receive(:flag!)
        do_request :reply_id => 1
      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
        @topic.stub_chain(:all_replies, :find).and_return(@reply)
        @reply.stub!(:flag!)
      end

      it "finds reply of topic" do
        @topic.all_replies.should_receive(:find).and_return(@reply)
        do_request :reply_id => 1
      end

      it "flags reply" do
        @reply.should_receive(:flag!)
        do_request :reply_id => 1
      end

    end

  end

  describe "POST vote up" do

    before(:each) do
      @reply = Factory(:reply)
    end

    def do_request(params = {})
      xhr :post, :vote_up, params.merge(:topic_id => @topic.id, :format => :json)
    end

    context "when user is not logged in" do

      it "responds with status 401" do
        do_request :reply_id => 1
        response.status.should == 401
      end

      it "doesn't get voted up" do
        @reply.should_not_receive(:vote_up!)
        do_request :reply_id => 1
      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
        @topic.stub_chain(:all_replies, :find).and_return(@reply)
        @reply.stub!(:vote_up!)
      end

      it "finds reply of topic" do
        @topic.all_replies.should_receive(:find).and_return(@reply)
        do_request :reply_id => 1
      end

      it "votes up reply" do
        @reply.should_receive(:vote_up!)
        do_request :reply_id => 1
      end

    end

  end

end

