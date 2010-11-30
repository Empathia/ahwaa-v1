require 'spec_helper'

describe Avatar do

  before(:each) do
    Factory(:avatar)
  end

  it { should have_many(:user_profiles) }
  it { should validate_presence_of(:url) }
  it { should validate_uniqueness_of(:url) }
  it { should belong_to(:gender) }
  it { should belong_to(:age) }

  describe 'get_matching_avatars_for_params' do 

    before(:each) do
      #Age.create(['12-16', '18-25', '24-35',
      #         '40-50', '50-65', '65+'].map { |i| {:range => i} })
      #Gender.create(%w[male female transgender no_say].map { |i| {:i18n_name => i} })
      Avatar.delete_all
      @age_range_12_16 = Factory(:age, :range => '12-16')
      @age_range_17_24 = Factory(:age, :range => '17-24')
      @age_range_25_34 = Factory(:age, :range => '25-34')
      @age_range_35_50 = Factory(:age, :range => '35-50')
      @age_range_51_65 = Factory(:age, :range => '51-65')
      @age_range_65_mo = Factory(:age, :range => '65+')

      @gender_male = Factory(:gender, :i18n_name => 'male')
      @gender_female = Factory(:gender, :i18n_name => 'female')
      @gander_transgender = Factory(:gender, :i18n_name => 'transgender')
      @gander_no_say = Factory(:gender, :i18n_name => 'no_say')

      @avatar1 = Factory(:avatar, 
                          :age => @age_range_12_16,
                          :gender => @gender_male
                        )
      @avatar2 = Factory(:avatar, 
                          :age => @age_range_12_16,
                          :gender => @gender_female
                        )
      @avatar3 = Factory(:avatar, 
                          :age => @age_range_17_24,
                          :gender => @gender_male
                        )
      @avatar4 = Factory(:avatar, 
                          :age => @age_range_17_24,
                          :gender => @gender_female
                        )
      @avatar5 = Factory(:avatar, 
                          :age => @age_range_25_34,
                          :gender => @gender_male
                        )
      @avatar6 = Factory(:avatar, 
                          :age => @age_range_25_34,
                          :gender => @gender_female
                        )
      @avatar7 = Factory(:avatar, 
                          :age => @age_range_35_50,
                          :gender => @gender_male
                        )
      @avatar8 = Factory(:avatar, 
                          :age => @age_range_35_50,
                          :gender => @gender_female
                        )


    end

    it 'should correctly match avatar options according to criteria' do
      Avatar.get_matching_avatars_for_params({
        :gender_id => @gender_male.id,
        :age_id => ''
      }).should == [@avatar1, @avatar3, @avatar5, @avatar7]

      Avatar.get_matching_avatars_for_params({
        :gender_id => @gender_male.id
      }).should == [@avatar1, @avatar3, @avatar5, @avatar7]

      Avatar.get_matching_avatars_for_params({
        :gender_id => @gender_male.id,
        :age_id => @age_range_12_16.id
      }).should == [@avatar1]

      (Avatar.get_matching_avatars_for_params({
        :gender_id => @gander_transgender.id,
        :age_id => ''
      }).to_a - [@avatar1, @avatar2, @avatar3, @avatar4, @avatar5, @avatar6, @avatar7, @avatar8]).should == []

      Avatar.get_matching_avatars_for_params({
        :gender_id => @gander_no_say.id,
        :age_id => @age_range_12_16.id
      }).should == [@avatar1, @avatar2]

      Avatar.get_matching_avatars_for_params({
        :age_id => @age_range_12_16.id
      }).should == [@avatar1, @avatar2]
    end

  end
end
