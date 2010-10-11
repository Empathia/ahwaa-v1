class UsersController < ApplicationController
  before_filter :get_user

  def show

  end

  def update
    flash[:notice] = t("flash.actions.update.notice") if @user.update_attributes(params[:user])
    respond_with(@user) do |format|
      format.html { redirect_to user_path }
    end
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
