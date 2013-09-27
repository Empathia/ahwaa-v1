class CleanStream
  @queue = :clean
  def self.perform(message)
    stream_message = StreamMessage.find(message)
    StreamUser.where("stream_message_id = ?", 4704).destroy_all
  end
end
