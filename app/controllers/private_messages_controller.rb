class PrivateMessagesController < ApplicationController
  before_filter :find_conversation, :only => [:show, :destroy]
  respond_to :html, :only => [:create, :destroy]
  respond_to :js, :only => [:index, :create, :show, :destroy]

  def index
    @messages = current_user.received_messages.group(:conversation_id).paginate(:page => params[:page], :per_page => 100).all
  end

  def show
    @conversation.read_for!(current_user)
    @replying = !!params[:reply]
  end

  def create
    @message = PrivateMessage.build_from_params(params, current_user)
    @message.save
    respond_to do |format|
      format.html {redirect_to :back, :notice => t('private_message.message_sent')}
      format.js {respond_with(@message)}
    end
  end

  def destroy
    @conversation.received_messages_thread(current_user).each(&:destroy)
    @loc = "/profile/" + current_user.username
  end

  private

  def find_conversation
    @conversation = current_user.received_messages.group(:conversation_id).find(params[:id]).conversation
  end
end
