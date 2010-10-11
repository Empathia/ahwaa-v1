require 'spec_helper'

describe Admin::BadWordsController do

  it "should deny access to regular users" do
    sign_in Factory(:user)
    get :show
    response.should be_redirect
  end

  context "as a signed in admin user" do

    before(:each) do
      @admin = Factory(:admin)
      sign_in @admin

      BadWord.set_bad_word_index('fool, stupid')
    end

    it 'should display all the bad words' do
      get :show
      assigns(:bad_words).should eq(['fool', 'stupid'])
    end

    it "should update the bad word list" do
      lambda do
        put :update, :bad_word_list => 'fool, dumbass, dumb'
      end.should change(BadWord, :count).by(2)
      response.should be_redirect
    end

  end
end
