class ApplicationController < ActionController::Base
  
  before_filter :authenticate_user!
  before_filter :authenticate_admin!
  
  protect_from_forgery
  
  private
    
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
