class GreetingsSender
  def initialize(sender_id, recipient_id, message = nil)
    @message = message
    @sender = sender_id
    @receiver = recipient_id
  end

  def send_thanks(topic_id = nil)
    greeting = Notification.new(:receiver_id => @receiver, :category => 'thanks')
    greeting.topic_id = topic_id if topic_id.present?
    greeting.sender_id = @sender

    if @message.present?
      pm = PrivateMessage.new(:sender_id => @sender, :recipient_id => @receiver)
      pm.content = @message
      pm.save
      greeting.private_message_id = pm.id
    end

    greeting.save
  end

  def send_welcome(recipient)
  end
end
