class SessionsController < ApplicationController
  respond_to :js, :only => [:create]
  skip_before_filter :authenticate_user!, :only => [:create]

  def create
    @user = User.find_for_database_authentication(params[:login])
    @authenticated = @user && @user.authenticate!(params[:password])
    session[:current_user] = @user.id if @authenticated
  end

  def destroy
    sign_out_current_user
    redirect_to root_path
  end
end
