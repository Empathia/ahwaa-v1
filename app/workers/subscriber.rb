class Subscriber
  @queue = :subscribe
  def self.perform(reply, message)
    reply = Reply.find reply
    stream_message = StreamMessage.find(message)
    reply.topic.subscribers.each do |user|
      StreamUser.create(:user => user, :stream_message => stream_message, :source => 'followed')
    end
  end
end
