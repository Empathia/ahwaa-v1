class ApplicationController < ActionController::Base
  include UrlHelper
  self.responder = ApplicationResponder
  respond_to :html

  before_filter :password_for_qa, :if => "Rails.env.production?"
  before_filter :authenticate_user!
  before_filter :authenticate_admin!
  before_filter :set_locale
  helper_method :current_user, :logged_in?, :rtl?

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

  def password_for_qa
    authenticate_or_request_with_http_basic do |username, password|
      username == 'qa' && password == 'test'
    end
  end

  def sign_out_current_user
    session[:current_user] = @current_user = nil
  end

  def rtl?      
    I18n.locale.to_s == 'ar'
  end
  
  # Include selected locale in links
  # def default_url_options(options = {})
  #   {:locale => I18n.locale}
  # end

  private

    # [Callback] sets locale or in the locale param or defaults to en
    def set_locale
      locale = request.subdomains.first
      if logged_in?
        redirect_to(root_url(:subdomain => current_user.profile.language)) and return unless locale == current_user.profile.language
      elsif locale.blank? || !I18n.available_locales.include?(locale.to_sym)
        lang = request.env['HTTP_ACCEPT_LANGUAGE'] =~ /ar/i ? 'ar' : 'en'
        redirect_to(root_url(:subdomain => lang)) and return
      end
      I18n.locale = locale
    end

    def authenticate_user!
      unless logged_in?
        flash[:alert] = t('flash.application.not_logged_in')
        respond_to do |format|
          format.json { render :json => {}, :location => root_path, :status => :unauthorized }
          format.html { redirect_to root_path }
        end
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
