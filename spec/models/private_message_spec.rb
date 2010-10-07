require 'spec_helper'

describe PrivateMessage do
  before(:each) do
    @pm = Factory(:private_message)
  end

  it { should belong_to(:sender) }
  it { should belong_to(:recipient) }
  it { should belong_to(:parent) }
  it { should validate_presence_of(:sender_id) }
  it { should validate_presence_of(:recipient_id) }
  it { should validate_presence_of(:content) }

  it "should be marked as unread by default" do
    @pm.unread?.should be_true
  end

  it "should flag conversation if has any unread reply" do
    5.times do
      @pm.replies << Factory(:private_message, :unread => false,
                             :sender => @pm.recipient, :recipient => @pm.sender)
    end
    @pm.replies << Factory(:private_message,
                           :sender => @pm.recipient, :recipient => @pm.sender)

    @pm.has_unread_reply?.should be_true
  end
end
