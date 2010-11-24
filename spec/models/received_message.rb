require 'spec_helper'

describe ReceivedMessage do
  before(:each) do
    Factory(:received_message)
  end

  it { should belong_to(:private_message) }
  it { should belong_to(:recipient) }
  it { should validate_presence_of(:recipient_id) }

  describe ".unread?" do

    before(:each) do
      @message = Factory(:received_message)
    end
    
    it "returns if read_at is nil or not" do
      @message.unread?.should == @message.read_at.nil?
    end

  end

  describe ".read!" do

    before(:each) do
      @message = Factory(:received_message)
    end

    it "sets read_at to current time" do
      @message.read!
      @message.read_at.to_i.should == Time.now.utc.to_i
    end

  end

  describe ".conversation" do

    before(:each) do
      @message = Factory(:received_message)
    end

    context "without parent" do

      it "returns private_message" do
        @message.conversation.should == @message.private_message
      end

    end

    context "with parent" do

      before(:each) do
        @message.private_message = Factory(:private_message, :parent => Factory(:private_message))
      end

      it "returns private_message's parent" do
        @message.conversation.should == @message.private_message.parent
      end

    end

  end

  describe ".conversation_replies" do

    before(:each) do
      @message = Factory(:received_message)
    end

    it "returns an array with all replies and self" do
      @message.conversation_replies.should == [@message.conversation]
    end

  end

end
