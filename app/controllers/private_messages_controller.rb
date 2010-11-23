class PrivateMessagesController < ApplicationController
  before_filter :find_private_message, :only => [:show, :destroy]
  respond_to :html, :only => [:destroy]
  respond_to :js, :only => [:index, :create, :show]

  def index
    @private_messages = current_user.private_messages.paginate(:page => params[:page])
  end

  def show
    @private_message.read!
    @replying = !!params[:reply]
  end

  def create
    @private_message = PrivateMessage.build_from_params(params)
    @private_message.sender = current_user
    UserMailer.private_message_notification(@private_message.recipient,
                                            @private_message.sender).deliver if @private_message.save
    respond_with(@private_message)
  end

  def destroy
    @private_message.destroy
    redirect_to user_path
  end

  private

  def find_private_message
    @private_message = current_user.private_messages.find(params[:id])
  end
end
