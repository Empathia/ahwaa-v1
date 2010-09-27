class ApplicationController < ActionController::Base

  before_filter :authenticate_user!
  before_filter :authenticate_admin!
  before_filter :set_locale

  protect_from_forgery

    private

    # [Callback] sets locale or in the locale param or defaults to en
    def set_locale
      if current_user
        I18n.locale = current_user.language
      else
        I18n.locale = params[:locale] rescue  I18n.locale = 'en'
      end
    end

    #
    def authenticate_admin!
      if self.class.name =~ /Admin/ && !current_user.is_admin?
        flash[:error] = t('c.application.should_be_admin')
        (redirect_to :back rescue redirect_to '/')
        false
      else
        true
      end
    end
end
