class NotificationsController < ApplicationController
  def create
    message = params[:notification][:include_message] == 'true' && params[:notification][:content].present? ? params[:notification][:content] : nil
    greeting = GreetingsSender.new(current_user.id, params[:notification][:receiver_id], message)

    if params[:notification][:category] == 'thanks'
      greeting.send_thanks(params[:notification][:topic_id])
    else
      greeting.send_welcome
    end

    respond_to do |format|
      format.html {redirect_to :back, :notice => t('private_message.message_sent')}
      format.js {respond_with(@notification)}
    end
  end
end
