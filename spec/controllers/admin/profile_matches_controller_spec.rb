require 'spec_helper'

describe Admin::ProfileMatchesController do
  before(:each) do
    @admin = Factory(:admin)
    sign_in @admin
  end

  describe "GET 'index'" do

    it "shouldnt show for a non exixting topic" do
      lambda do
        get :index, :topic_id => 1
      end.should raise_error
    end

    context 'with an existing topic' do

      before(:each) do
        @topic = Factory(:topic)
      end

      it "should show for an existing topic" do
        get :index, :topic_id => @topic.id
        response.should_not be_redirect
        assigns(:topic).should == @topic
      end

      context 'listing matches' do

        it 'should list matching criteria' do
          filters = {
            "religion_id" =>  1,
            "gender_id" => 1,
            "sexual_orientation_id" => 1,
            "age_id" => 1,
            "political_view_id" => 1
          }
          p = mock_model(UserProfile, :user_id => 1)
          u = mock_model(User)
          UserProfile.should_receive(:get_matching_profiles_from_params).with(filters).and_return([p,p])
          User.should_receive(:find).with([1,1]).and_return([u,u])
          post :list_matches, :topic_id => @topic.id, :format => 'js', :filters => filters
          response.should be_succes
          assigns(:users).should == [u,u]
        end

        it 'should notify user' do
          user = mock_model(User, :is_expert? => false)
          user.should_receive(:notify_about_topic!).with(@topic)
          User.should_receive(:find).with(1).and_return(user)
          post :notify, :topic_id => @topic.id, :id => 1, :format => 'js'
          response.should be_succes
          assigns(:user).should == user
        end

        it 'should notify user and add to leader board if user is an expert' do
          user = mock_model(User, :is_expert? => true)
          topic = mock_model(Topic, :id => 1)
          collection = mock('col')
          collection.should_receive(:<<).with(user)
          topic.should_receive(:experts).and_return(collection)
          user.should_receive(:notify_about_topic!).with(topic)
          User.should_receive(:find).with(1).and_return(user)
          Topic.should_receive(:find).with(1).and_return(topic)
          post :notify, :topic_id => topic.id, :id => 1, :format => 'js'
          response.should be_succes
          assigns(:user).should == user
        end
      end
    end
  end
end
