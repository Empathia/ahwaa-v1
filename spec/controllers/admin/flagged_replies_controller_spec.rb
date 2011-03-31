require 'spec_helper'

describe Admin::FlaggedRepliesController do

  describe "GET 'index'" do
    it "should not give acces if not an admin user" do
      get 'index'
      response.should_not be_success
    end

    context 'as an admin user' do
      before(:each) do 
        @admin = Factory(:admin)
        sign_in @admin 
      end

      context 'with flagged and non flagged replies' do
        before(:each) do
          @flag  = Factory(:flag)
          @vote_up = Factory(:vote_up)
          @flagged_reply =  @flag.reply
          @voted_up_reply = @vote_up.reply
        end

        it 'should only list flagged replies' do 
          get :index 
          response.should be_success
          assigns(:flags).should == [@flagged_reply]
        end

        it 'should only list flagged reply once if its flagged twice' do 
          @another_flag = Factory(:flag, :reply => @flagged_reply)
          get :index
          assigns(:flags).should == [@flagged_reply]
          @flagged_reply.flags.should == [@flag, @another_flag]
        end

        it 'should be able to delete the flagged reply' do
          lambda do
            delete :destroy, :id => @flagged_reply.id
          end.should change(Reply, :count).by(-1)
        end
      end

    end

  end

  describe "PUT 'unflag'" do

    before do
      @reply = Factory(:reply)
    end

    def do_request(params = {})
      put :unflag, params
    end

    context "when admin is logged in" do

      before do
        @admin = Factory(:admin)
        sign_in @admin 
      end

      it "destroys all flags for the reply" do
        Reply.should_receive(:find).with(1).and_return(@reply)
        @reply.flags.should_receive(:clear)
        do_request :id => 1
      end

    end

  end

end
