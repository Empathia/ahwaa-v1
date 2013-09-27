class SubscriberOwner
  @queue = :subscribe
  def self.perform(reply, message)
    reply = Reply.find reply
    stream_message = StreamMessage.find(message)
    StreamUser.create(:user => reply.topic.user, :stream_message => stream_message, :source => 'owned')
  end
end
