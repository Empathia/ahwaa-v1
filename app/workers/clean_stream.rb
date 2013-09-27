class CleanStream
  @queue = :clean
  def self.perform(message)
    StreamUser.where("stream_message_id = ?", message).destroy_all
  end
end
