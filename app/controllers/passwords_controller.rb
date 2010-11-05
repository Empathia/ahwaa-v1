class PasswordsController < ApplicationController
  skip_before_filter :authenticate_user!
  respond_to :json, :only => [:create]

  def create
    @user = User.find_for_database_authentication(params[:login])
    if @user
      @user.reset_single_access_token!
      UserMailer.password_reset(@user).deliver 
      respond_with(@user, :location => root_path)
    else
      respond_with(:status => :not_found, :location => root_path)
    end
  end
end
