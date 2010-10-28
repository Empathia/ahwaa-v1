require 'spec_helper'

describe RepliesController do

  before(:each) do
    @user = Factory(:user)
    @topic = Factory(:topic)
  end

  describe 'POST create' do

    before(:each) do
      @reply = Factory.build :reply
      Topic.stub!(:find).and_return(@topic)
      @topic.stub_chain(:replies, :build).and_return(@reply)
    end

    def do_request(params = {})
      xhr :post, :create, params.merge(:topic_id => @topic.id, :format => :json)
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

        it "responds with status 201" do
          do_request
          response.status.should == 201
        end

        it "creates a new reply for the topic" do
          @reply.should_receive(:save).and_return(true)
          do_request
        end

      end

      context "when reply fails to save" do

        before(:each) do
          @reply.stub!(:save).and_return(false)
          @reply.stub!(:errors).and_return([{}])
        end

        it "responds with status 422" do
          do_request
          response.status.should == 422
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

        it "responds with status 201" do
          do_request
          response.status.should == 201
        end

        it "creates a new reply for the topic" do
          @reply.should_receive(:save).and_return(true)
          do_request
        end

      end

      context "when reply fails to save" do

        before(:each) do
          @reply.stub!(:save).and_return(false)
          @reply.stub!(:errors).and_return([{}])
        end

        it "responds with status 422" do
          do_request
          response.status.should == 422
        end
        
      end

    end

  end

end

