require 'spec_helper'

describe PrivateMessage do
  before(:each) do
    Factory(:private_message)
  end

  it { should belong_to(:sender) }
  it { should belong_to(:recipient) }
  it { should belong_to(:parent) }
  it { should have_many(:replies) }
  it { should have_one(:received_message) }
  it { should validate_presence_of(:sender_id) }
  it { should validate_presence_of(:recipient_id) }
  it { should validate_presence_of(:content) }

  describe "being created" do

    before(:each) do
      @sender = Factory(:user)
      @recipient = Factory(:user)
      @message = Factory(:private_message, :sender => @sender, :recipient => @recipient)
    end

    it "creates received messages for recipient" do
      @recipient.received_messages.should == [@message.received_message]
    end

    it "sets conversation id for received message to self id" do
      @message.received_message.conversation_id.should == @message.id
    end

    context "with parent" do

      before(:each) do
        @parent = Factory(:private_message)
        @message = Factory(:private_message, :parent => @parent)
      end

      it "sets conversation id for received message to parent id" do
        @message.received_message.conversation_id.should == @parent.id
      end

    end

  end

  describe ".build_from_params" do
    
    it "creates an instance with recipient and sender initialized" do
      @recipient = Factory(:user)
      @sender = Factory(:user)
      @message = PrivateMessage.build_from_params({
        :user_id => @recipient.username,
        :private_message => {
          :content => "content of message"
        }
      }, @sender)
      @message.recipient.should == @recipient
      @message.content.should == "content of message"
      @message.sender.should == @sender
    end

  end

  context "in conversations" do

    before(:each) do
      @conversation = Factory(:private_message)
      5.times do
        @conversation.replies << Factory(:private_message,
                                         :recipient => @conversation.recipient)
      end
    end

    it "marks all messages as read" do
      @conversation.unread_by?(@conversation.recipient).should be_true
      @conversation.read_for!(@conversation.recipient)
      @conversation.unread_by?(@conversation.recipient).should be_false
    end

  end

end
