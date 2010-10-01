class ApplicationController < ActionController::Base
  self.responder = ApplicationResponder
  respond_to :html

  before_filter :authenticate_user!
  before_filter :authenticate_admin!
  before_filter :set_locale

  protect_from_forgery

  private

    # [Callback] sets locale or in the locale param or defaults to en
    def set_locale
      if current_user
        I18n.locale = current_user.profile.language
      else
        I18n.locale = params[:locale] if params[:locale].present?
      end
    end

    # Validate admin authentication if route is within the /admin path
    def authenticate_admin!
      if self.class.name =~ /Admin/ && !current_user.is_admin?
        flash[:alert] = t('flash.application.should_be_admin')
        (redirect_to :back rescue redirect_to '/')
        false
      else
        true
      end
    end
end
