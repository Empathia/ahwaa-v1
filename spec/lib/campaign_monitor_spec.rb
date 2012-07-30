require 'spec_helper'

describe CampaignMonitor do
  before do
    @user  = Factory.create(:user, :email => 'subscriber@ahwaa.org')
  end

  context "load" do

    it "should load the campaign monitor for querying" do
      campaign = CampaignMonitor.send(:load)
      campaign.class.should == CreateSend::CreateSend
    end

  end

  context "add subscriber" do
    before do
      stub_post(APP_CONFIG['campaign_monitor']['key'], "subscribers/#{APP_CONFIG['campaign_monitor']['lists']['inactive']}.json", "add_subscriber.json")
    end

    it "should add it to the specified list" do
      CampaignMonitor.stub(:already_subscribed_to?).and_return(false)
      new_user = CampaignMonitor.add_subscriber(@user, 'inactive')
      new_user.should == @user.email
    end

    it "should check if the user already exist in the list specified" do
      CampaignMonitor.stub(:already_subscribed_to?).and_return(true)
      CreateSend::Subscriber.should_not_receive(:add)
      new_user = CampaignMonitor.add_subscriber(@user, 'inactive')
    end

  end

  context "remove subscriber" do
    before do
      stub_delete(APP_CONFIG['campaign_monitor']['key'], "subscribers/#{APP_CONFIG['campaign_monitor']['lists']['inactive']}.json?email=#{CGI.escape(@user.email)}", nil)
    end

    it "should remove it to the specified list" do
      CampaignMonitor.stub(:already_subscribed_to?).and_return(true)
      # CreateSend::Subscriber.should_receive(:delete).once
      remove_user = CampaignMonitor.remove_subscriber(@user, 'inactive')
      remove_user['TotalNumberOfRecords'].should == 1
    end

    it "should check if the user already exist in the list specified" do
      CampaignMonitor.stub(:already_subscribed_to?).and_return(false)
      CreateSend::Subscriber.should_not_receive(:delete)
      remove_user = CampaignMonitor.remove_subscriber(@user, 'inactive')
    end

  end

  context "already subscribed" do

    it "should check if the user already exist in the list specified" do
      stub_get(APP_CONFIG['campaign_monitor']['key'], "subscribers/#{APP_CONFIG['campaign_monitor']['lists']['inactive']}.json?email=#{CGI.escape(@user.email)}", "subscriber_details.json")
      subscriber = CampaignMonitor.already_subscribed_to?(@user, 'inactive')
      subscriber['EmailAddress'].should == @user.email
    end

  end

  context "already subscribed" do

    it "should check if the user already exist in the list specified" do
      stub_get(APP_CONFIG['campaign_monitor']['key'], "lists/#{APP_CONFIG['campaign_monitor']['lists']['inactive']}/active.json?pagesize=1000&orderfield=email&page=1&orderdirection=asc&date=#{CGI.escape(Date.today.yo_s)}", "active_subscribers.json")
      subscriber = CampaignMonitor.get_subscribed_list('inactive')
      subscriber['TotalNumberOfRecords'].should == 1
    end

  end

  context "get list id" do

    it "should return the list id for the specified list name" do
      list_id = CampaignMonitor.get_list_id('inactive')
      list_id.should == APP_CONFIG['campaign_monitor']['lists']['inactive']
    end

  end

end
