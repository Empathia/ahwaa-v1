class UsersController < ApplicationController
  respond_to :js, :only => [:update, :create]
  before_filter :get_user
  skip_before_filter :authenticate_user!, :only => [:create]

  def show
  end

  def inbox
    @messages = @user.received_messages.paginate(:page => params[:page], :per_page => 10)
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      flash[:notice] = t('flash.users.create.notice')
      @user.notify_sign_up_confirmation!
    end
  end

  def update
    @user.update_attributes(params[:user])
  end

  def destroy
    sign_out_current_user
    @user.destroy
    respond_with(@user, :location => root_path)
  end

  protected

  def get_user
    @user = current_user
  end

end
