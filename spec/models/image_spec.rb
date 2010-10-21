# coding: utf-8
require 'spec_helper'

describe Image do
  before(:each) do
    Factory(:twitpic_image)
  end

  it { should belong_to(:topic) }
  it { should validate_presence_of(:topic_id) }
  it { should validate_presence_of(:source_url) }
  it { should validate_uniqueness_of(:source_url).scoped_to(:topic_id) }

  context "from flickr" do
    before(:each) do
      @flickr = Factory(:flickr_image)
    end

    it "should detect the url is from flickr.com" do
      @flickr.from_flickr?.should be_true
      @flickr.from_twitpic?.should be_false
    end

    it "should fetch the title and description from the flickr API" do
      @flickr.title.should == "El Osario"
      @flickr.description.should == "El Osario ou Túmulo do Grande Sacerdote\nChichén Itzá - Yucatán\nMéxico"
    end

    it "should download the thumbnail image" do
      @flickr.thumbnail.url(:original, false).should == "/system/thumbnails/#{@flickr.id}/original/5038885831_a688701830.jpg"
    end

    it "should raise an InvalidFlickrResponse if response is invalid" do
      lambda do
        Factory(:flickr_image, :source_url => "http://www.flickr.com/photos/anasilva/10")
      end.should raise_error(Fetchers::InvalidFlickrResponse)
    end
  end


  context "from twitpic" do
    before(:each) do
      @twitpic = Factory(:twitpic_image)
    end

    it "should detect the url is from twitpic.com" do
      @twitpic.from_twitpic?.should be_true
      @twitpic.from_flickr?.should be_false
    end

    it "should fetch the title and description from the twitpic API" do
      @twitpic.title.should == "JetBlue's Social Media Support Team watches JetBlue feed."
      @twitpic.description.should == "JetBlue's Social Media Support Team watches JetBlue feed."
    end

    it "should download the thumbnail image" do
      @twitpic.thumbnail.url(:original, false).should == "/system/thumbnails/#{@twitpic.id}/original/2wrxo7.jpg"
    end

    it "should raise an InvalidTwitpicResponse if response is invalid" do
      lambda do
        Factory(:twitpic_image, :source_url => "http://twitpic.com/x")
      end.should raise_error(Fetchers::InvalidTwitpicResponse)
    end
  end

  context "from raw image" do
    before(:each) do
      @raw = Factory(:raw_image)
    end

    it "should detect the url is a raw image" do
      @raw.from_raw?.should be_true
    end

    it "should have the same thumbnail url" do
      @raw.thumbnail.url(:original, false).should == "/system/thumbnails/#{@raw.id}/original/Ruby Gemstone.jpg"
    end

    it "should have title and description entered by the admin" do
      pending "Pass title and description to the attributes"
    end
  end
end
