class UserSessionsController < ApplicationController
  def new
  end

  def create
    @user = User.find_by_username(params[:username])
    if @user
      if @user.authenticate(params[:password])
        session[:current_user_id] = @user.id
        redirect_to root_path, :notice => t('.success')
      else
        flash[:alert] = t('.cant_authenticate')
        render 'new'
      end
    else
      flash[:alert] = t('.not_found')
      render 'new'
    end
  end

  def destroy
    session[:current_user_id] = nil
    redirect_to root_path, :notice => t('.success')
  end
end
