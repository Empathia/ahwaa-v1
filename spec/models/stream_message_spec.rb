require 'spec_helper'

describe StreamMessage do
  before do
    Factory(:stream_message)
  end

  it { should belong_to(:reply) }
  it { should have_many(:stream_users) }

  context "after creation" do

    it "publish to subscribers" do
      @stream = Factory.build(:stream_message)
      @stream.should_receive(:publish!)
      @stream.save
    end

  end
end
