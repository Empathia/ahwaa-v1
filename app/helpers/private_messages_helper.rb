module PrivateMessagesHelper

  def url_for_message_reply(message)
    user = message.sender == current_user ? message.recipient : message.sender
    user_private_messages_path(user)
  end
end
