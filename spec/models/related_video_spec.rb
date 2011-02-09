require 'spec_helper'

describe RelatedVideo do
  before(:each) do
    Factory(:related_video)
  end

  it { should belong_to(:topic) }
  it { should validate_presence_of(:topic_id) }
  it { should validate_presence_of(:source_url) }
  it { should validate_uniqueness_of(:source_url).scoped_to(:topic_id) }

  context "with vimeo url" do
    before(:each) do
      @vimeo = Factory(:vimeo_video)
    end

    it "should detect that the source url is from vimeo" do
      @vimeo.from_vimeo?.should be_true
      @vimeo.from_youtube?.should be_false
    end

    it "should fetch title and description from API" do
      @vimeo.title.should == "Balloon Fiesta"
      @vimeo.description.should == "Annual Balloon Fiesta in Albuquerque NM\n\nShot with a 7D with 28-135 and 70-200\n\nMusic: Phoneme by STS9\n\nHD version is up!"
    end

    it "should fetch the video's thumbnail and store it" do
      @vimeo.thumbnail.url(:original, false).should == "/system/thumbnails/#{@vimeo.id}/original/109796897_100.jpg"
    end

    it "should raise an exception if no response is got" do
      lambda do
        Factory(:vimeo_video, :source_url => "http://vimeo.com/1")
      end.should raise_error(Fetchers::InvalidVimeoResponse)
    end
  end

  context "with youtube url" do
    before(:each) do
      @youtube = Factory(:youtube_video)
    end

    it "should detect that the source url is from youtube" do
      @youtube.from_youtube?.should be_true
      @youtube.from_vimeo?.should be_false
    end

    it "should fetch title and description from API" do
      @youtube.title.should == "Bunnies Can't Dive"
      @youtube.description.should == "Bunnies very useful scientific facts:\n\nBunnies can't dive...\n... but...\n... they...\n... can...\n... dance!"
    end

    it "should fetch the video's thumbnail and store it" do
      @youtube.thumbnail.url(:original, false).should == "/system/thumbnails/#{@youtube.id}/original/0.jpg"
    end

    it "should raise an exception if no response is got" do
      lambda do
        Factory(:youtube_video, :source_url => "http://www.youtube.com/watch?v=k7")
      end.should raise_error(Fetchers::InvalidYoutubeResponse)
    end
  end
end
