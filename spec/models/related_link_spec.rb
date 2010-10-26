require 'spec_helper'

describe RelatedLink do
  before(:each) do
    @link = Factory(:related_link)
  end

  it { should belong_to(:topic) }
  it { should validate_presence_of(:topic_id) }
  it { should validate_presence_of(:source_url) }
  it { should validate_uniqueness_of(:source_url).scoped_to(:topic_id) }

  context "beign created" do
    it "should fetch title and description from scraping the link" do
      @link.title.should == "Chile conmueve al mundo con el rescate de los 33 mineros · ELPAÍS.com"
      @link.description.should == "Chile conmueve al mundo con el rescate de los 33 mineros"
    end
  end

end
