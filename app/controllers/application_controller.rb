class ApplicationController < ActionController::Base
  self.responder = ApplicationResponder
  respond_to :html

  before_filter :authenticate_user!
  before_filter :authenticate_admin!
  before_filter :set_locale
  helper_method :current_user, :logged_in?

  protect_from_forgery

  # Wether there's a user logged in
  def logged_in?
    !current_user.nil?
  end

  # Retrieves current logged in user from the session
  def current_user
    @current_user ||= User.find_by_id(session[:current_user])
  end

  protected

  def sign_out_current_user
    session[:current_user] = @current_user = nil
  end

  private

    # [Callback] sets locale or in the locale param or defaults to en
    def set_locale
      if current_user
        I18n.locale = current_user.profile.language
      else
        I18n.locale = params[:locale] if params[:locale].present?
      end
    end

    def authenticate_user!
      unless logged_in?
        flash[:alert] = t('flash.application.not_logged_in')
        redirect_to login_path
      end
    end

    # Validate admin authentication if route is within the /admin path
    def authenticate_admin!
      if self.class.name =~ /Admin/ && !current_user.is_admin?
        flash[:alert] = t('flash.application.should_be_admin')
        (redirect_to :back rescue redirect_to root_path)
        false
      else
        true
      end
    end
end
