require 'spec_helper'

describe UserProfile do
  before(:each) do
    @profile = Factory(:user_profile)
  end

  it { should belong_to(:user) }
  it { should belong_to(:avatar) }
  it { should validate_presence_of(:language) }
  it { should allow_value('en').for(:language) }
  it { should allow_value('ar').for(:language) }
  it { should_not allow_value('es').for(:language) }

  it "should build a default avatar if none is choosen" do
    @profile.avatar.should_not be_nil
    @profile.avatar.url.should == Avatar.default.url
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

    it 'should match data accorfing to filters' do
      UserProfile.get_matching_profiles_from_params({
        :religion_id =>  @religion_islam.id,
        :gender_id => @gender_female.id,
        :sexual_orientation_id => @sexual_orientation_gay.id,
        :age_id => @age_range_17_18.id,
        :political_view_id => @political_view_conservative.id
      }).should == [@user_profile_2, @user_profile_3]
    end
  end

end
