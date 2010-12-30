require 'spec_helper'

describe User do
  before(:each) do
    @user = Factory(:user)
  end

  it { should have_one(:score_board)}
  it { should have_one(:current_level)}
  it { should have_one(:current_badge)}
  it { should have_one(:current_prize)}

  it { should validate_uniqueness_of(:username) }
  it { should validate_uniqueness_of(:email) }
  it { should_not allow_mass_assignment_of(:encrypted_password) }
  it { should_not allow_mass_assignment_of(:password_salt) }
  it { should_not allow_mass_assignment_of(:responses_count) }
  it { should_not allow_mass_assignment_of(:is_expert) }
  it { should_not allow_mass_assignment_of(:is_admin) }

  ['bademail', 'bad@email', 'bad @email', 'bad.email', 'bad$%@email.com', '@bademail',
    '@bademail.com', 'bad@$#$.com', 'bad@@email.com'].each do |email|
    it { should_not allow_value(email).for(:email) }
  end

  ['bad login', 'bad.login', 'bad*login', 'bad^login', '&badlogin', 'badlogin?',
    '@badlogin', 'bad#login', 'bad$login'].each do |login|
    it { should_not allow_value(login).for(:username) }
  end

  context "upon creation" do
    
    it "should have a profile" do
      @user.profile.should_not be_nil
    end

    it "should not be expert nor admin" do
      @user.is_expert?.should_not be_true
      @user.is_admin?.should_not be_true
    end

    it "should generate a temporary password if none" do
      @user = Factory(:user, :password => nil)
      @user.password.should_not be_blank
      @user.authenticate!(@user.password).should be_true
    end

    it 'should have a scoreboard' do
      @user.score_board.should_not be_nil
    end

  end

  context 'level badge prize assignation' do
    it 'should assign a reward' do
      @level = Factory(:level)
      @user.set_reward(@level) 
      @user.reload.current_level.should == @level
    end
  end

  context 'update scoreboard' do
    it 'should update scoreboard with x amount of points' do
      lambda do
        @user.update_score_board(1)
      end.should change(@user.score_board, :current_points).by(1)
    end
  end

  describe 'notify_about_topic!' do
    it 'should send email when notified to participate on a topic' do
      @topic = Factory(:topic)
      mock_mailer = mock('mailer', :deliver => true) 
      UserMailer.should_receive(:topic_match_notification).with(@user,@topic).and_return(mock_mailer)
      @user.notify_about_topic!(@topic)
    end
  end

  describe "notify_password_reset!" do

    before(:each) do
      @mock_mailer = mock('mailer', :deliver => true)
    end

    it "should send email with password reset instructions" do
      UserMailer.should_receive(:password_reset).with(@user).and_return(@mock_mailer)
      @user.should_receive(:reset_single_access_token!)
      @user.notify_password_reset!
    end

  end

  describe "notify_sign_up_confirmation!" do

    before(:each) do
      @mock_mailer = mock('mailer', :deliver => true)
    end

    it "should send email when signed up" do
      UserMailer.should_receive(:sign_up_confirmation).with(@user).and_return(@mock_mailer)
      @user.notify_sign_up_confirmation!
    end

  end

  describe "notify_private_message!" do

    before(:each) do
      @mock_mailer = mock('mailer', :deliver => true)
    end

    it "should send email when received a private message" do
      sender = Factory(:user)
      UserMailer.should_receive(:private_message_notification).with(@user, sender).and_return(@mock_mailer)
      @user.notify_private_message!(sender)
    end

  end

  describe "with_user_locale" do

    before(:each) do
      I18n.locale = 'en'
      @user.profile.update_attribute(:language, 'ar')
      @user.profile.language.should == 'ar'
    end

    it "scopes block to user's locale" do
      I18n.locale.should == :en
      @user.with_user_locale do
        I18n.locale.should == :ar
      end
      I18n.locale.should == :en
    end

  end

end

