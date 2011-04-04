require 'spec_helper'

describe SubscriptionsController do

  describe "GET 'unsubscribe'" do

    def do_request(params = {})
      get :unsubscribe, params
    end

    it "finds subscription with given token" do
      Subscription.should_receive(:find_by_hash_key).with('foo')
      do_request :id => 'foo'
    end

    context "with valid token" do

      before do
        @subscription = Factory(:subscription)
        Subscription.stub!(:find_by_hash_key).and_return(@subscription)
      end

      it "removes subscription for user on the topic" do
        @subscription.should_receive(:destroy)
        do_request :id => 'foo'
      end

      it "redirects to topic path" do
        do_request :id => 'foo'
        response.should redirect_to(@subscription.topic)
      end

    end

    context "with invalid token" do

      before do
        @subscription = Factory(:subscription)
        Subscription.stub!(:find_by_hash_key).and_return(nil)
      end

      it "redirects to root path" do
        do_request :id => 'foo'
        response.should redirect_to(root_path)
      end

    end

  end

end
