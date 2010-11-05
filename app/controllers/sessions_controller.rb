class SessionsController < ApplicationController
  respond_to :json, :only => [:create]
  skip_before_filter :authenticate_user!, :only => [:create]

  def create
    @user = User.find_for_database_authentication(params[:login])
    if @user && @user.authenticate!(params[:password])
        session[:current_user] = @user.id
        respond_with(@user)
    elsif @user
        respond_with(:status => :unauthorized, :location => root_path)
    else
      respond_with(:status => :not_found, :location => root_path)
    end
  end

  def destroy
    sign_out_current_user
    redirect_to root_path
  end
end
