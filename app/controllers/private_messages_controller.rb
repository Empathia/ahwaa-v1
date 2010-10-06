class PrivateMessagesController < ApplicationController
  before_filter :find_private_message, :only => [:show, :destroy]
  respond_to :html, :json

  def index
    @private_messages = current_user.private_messages
  end

  def show
  end

  def create
    @private_message = PrivateMessage.build_from_params(params)
    @private_message.sender = current_user
    @private_message.save
    respond_with(@private_message)
  end

  def destroy
    @private_message.destroy
    respond_with(@private_message)
  end

  private

  def find_private_message
    @private_message = current_user.private_messages.find(params[:id])
  end
end
