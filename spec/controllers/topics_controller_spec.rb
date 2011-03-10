require 'spec_helper'

describe TopicsController do
  before(:each) do
    @user = Factory(:user)
  end

  describe "GET tag" do

    def do_request(params = {})
      get :tag, params.merge(:tag => "foo")
    end

    before(:each) do
      @topics = Topic.scoped
      @topics.stub_chain(:tagged_with, :in_groups_of).and_return([])
    end

    context "when no param is given" do

      before(:each) do
        Topic.stub!(:newest).and_return(@topics)
      end

      it "sorts by newest" do
        Topic.should_receive(:newest).and_return(@topics)
        do_request
      end

      it "filters topics by tag" do
        @topics.tagged_with(any_args).should_receive(:in_groups_of).and_return([])
        do_request
      end

    end

    context "when param :by_response is given" do

      before(:each) do
        Topic.stub!(:by_replies_count).and_return(@topics)
      end

      it "sorts by replies count" do
        Topic.should_receive(:by_replies_count).and_return(@topics)
        do_request :by_responses => '1'
      end

      it "filters topics by tag" do
        @topics.tagged_with(any_args).should_receive(:in_groups_of).and_return([])
        do_request :by_responses => '1'
      end

    end

  end

  describe "GET show" do

    def do_request(params = {})
      get :show, params
    end

    before(:each) do
      Topic.stub_chain(:includes, :find).and_return(@topic = Factory(:topic))
      @topic.stub_chain(:replies, :group_by).and_return(@replies = Reply.scoped)
    end

    context "when user isn't logged in" do

      it "render show template" do
        do_request :id => 1
        response.should render_template(:show)
      end

      it "should find topic" do
        Topic.includes(:replies).should_receive(:find).and_return(@topic)
        do_request :id => 1
      end

      it "should group replies of topic by contextual index" do
        @topic.replies.should_receive(:group_by).and_return(@replies)
        do_request :id => 1
      end

    end

    context "when user is logged in" do

      before(:each) do
        sign_in @user
      end

      it "render show template" do
        do_request :id => 1
        response.should render_template(:show)
      end

      it "should find topic" do
        Topic.includes(:replies).should_receive(:find).and_return(@topic)
        do_request :id => 1
      end

      it "should group replies of topic by contextual index" do
        @topic.replies.should_receive(:group_by).and_return(@replies)
        do_request :id => 1
      end

    end

  end

end
