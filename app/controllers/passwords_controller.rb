class PasswordsController < ApplicationController
  skip_before_filter :authenticate_user!
  respond_to :js, :only => [:create]
  before_filter :find_user, :only => [:edit, :update]

  def create
    @user = User.find_for_database_authentication(params[:login])
    @user.notify_password_reset! if @user
  end

  def edit
  end

  def update
    @user.reset_single_access_token!
    @user.update_attribute(:password, params[:password])
    redirect_to root_path, :notice => t('flash.passwords.update.notice')
  end

  private

  def find_user
    @user = User.find_by_single_access_token!(params[:id])
  end
end
