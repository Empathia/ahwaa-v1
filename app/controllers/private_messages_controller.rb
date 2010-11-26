class PrivateMessagesController < ApplicationController
  before_filter :find_conversation, :only => [:show, :destroy]
  respond_to :html, :only => [:destroy]
  respond_to :js, :only => [:index, :create, :show, :destroy]

  def index
    @messages = current_user.received_messages.paginate(:page => params[:page])
  end

  def show
    @conversation.read_for!(current_user)
    @replying = !!params[:reply]
  end

  def create
    @message = PrivateMessage.build_from_params(params, current_user)
    @message.save
    respond_with(@message)
  end

  def destroy
    @conversation.received_messages_thread(current_user).each(&:destroy)
  end

  private

  def find_conversation
    @conversation = current_user.received_messages.find(params[:id]).conversation
  end
end
