class SubscriberEvery
  @queue = :subscribe
  def self.perform(message)
    stream_message = StreamMessage.find(message)
    User.all.each do |user|
      StreamUser.create(:user => user, :stream_message => stream_message, :source => 'global')
    end
  end
end
