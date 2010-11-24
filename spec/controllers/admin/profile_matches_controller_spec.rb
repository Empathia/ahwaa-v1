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
        get :show, :topic_id => @topic.id
        response.should_not be_redirect
        assigns(:topic).should == @topic
      end

      context 'with existing user profiles and matching criteria' do
        
        before(:each) do
          @religion_agnostic = Factory(:religion, :i18n_name => 'agnostic')
          @religion_islam = Factory(:religion, :i18n_name => 'islam')

          @gender_male = Factory(:gender, :i18n_name => 'male')
          @gender_female = Factory(:gender, :i18n_name => 'female')

          @sexual_orientaton_straight = Factory(:sexual_orientation, :i18n_name => 'straight')
          @sexual_orientation_gay = Factory(:sexual_orientation, :i18n_name => 'gay')

          @age_range_12_16 = Factory(:age, :range => '12-16')
          @age_range_17_18 = Factory(:age, :range => '17-18')

          @political_view_liberal = Factory(:political_view, :i18n_name => 'liberal')
          @political_view_conservative = Factory(:political_view, :i18n_name => 'conservative')
        
          @user_profile_1 = Factory(:user_profile,
                                      :religion => @religion_agnostic,
                                      :gender => @gender_male,
                                      :sexual_orientation => @sexual_orientation_straight,
                                      :age => @age_range_12_16,
                                      :political_view => @political_view_liberal
                                   )
          @user_profile_2 = Factory(:user_profile,
                                      :religion => @religion_islam,
                                      :gender => @gender_female,
                                      :sexual_orientation => @sexual_orientation_gay,
                                      :age => @age_range_17_18,
                                      :political_view => @political_view_conservative
                                   )

          @user_profile_3 = Factory(:user_profile,
                                      :religion => @religion_islam,
                                      :gender => @gender_female,
                                      :sexual_orientation => @sexual_orientation_gay,
                                      :age => @age_range_17_18,
                                      :political_view => @political_view_conservative
                                   )
        end

        it 'should list matching criteria' do
          post :list_matches, :topic_id => @topic.id, :format => 'js', :filters => {
            :religion_id =>  @religion_islam.id,
            :gender_id => @gender_female.id,
            :sexual_orientation_id => @sexual_orientation_gay.id,
            :age_id => @age_range_17_18.id,
            :political_view_id => @political_view_conservative.id
          }
          response.should be_succes
          assigns(:users).should == [@user_profile_2.user, @user_profile_3.user]
        end
      end
    end
  end
end
