require 'spec_helper'

describe TopicsController do
  before(:each) do
    @user = Factory(:user)
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
