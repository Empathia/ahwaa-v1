class SessionsController < ApplicationController
  skip_before_filter :authenticate_user!, :only => [:create]

  def create
    user = User.find_for_database_authentication(params[:login])
    @error = nil
    if user
      if user.authenticate!(params[:password])
        session[:current_user] = user.id
      else
        @error = t('flash.sessions.create.invalid_password')
      end
    else
      @error = t('flash.sessions.create.not_found')
    end
    respond_to do |format|
      format.js
    end
  end

  def destroy
    sign_out_current_user
    redirect_to :back rescue redirect_to root_path
  end
end
