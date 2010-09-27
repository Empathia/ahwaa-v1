class UsersController < ApplicationController

  before_filter :get_user

  def show

  end

  def update
    if @user.update_attributes(params[:user])
      flash[:notice] = t('c.users.update_success')
      redirect_to user_path
    else
      flash[:error] = t('c.users.update_error')
      redirect_to user_path
    end
  end

  def destroy
    if @user.destroy
      sign_out @user
      flash[:notice] = t('c.users.destroy_success')
      redirect_to '/'
    else
      flash[:error] = t('c.users.destroy_error')
      redirect_to user_path
    end
  end

  protected

  def get_user
    @user = current_user
  end

end
