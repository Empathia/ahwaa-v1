class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :current_user

  # Fetchs the current user from the session
  def current_user
    @current_user ||= User.find_by_id(session[:current_user_id])
  end
end
