class ApplicationController < ActionController::Base
  include UrlHelper
  self.responder = ApplicationResponder
  respond_to :html

  before_filter :authenticate_user!
  before_filter :authenticate_admin!
  before_filter :set_locale
  before_filter :hall_of_fame
  helper_method :current_user, :logged_in?, :rtl?

  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

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

  def rtl?      
    I18n.locale.to_s == 'ar'
  end
  
  # Include selected locale in links
  # def default_url_options(options = {})
  #   {:locale => I18n.locale}
  # end

  private

  def hall_of_fame
    @fame_helpful = Rating.select('reply_id, user_id, sum(vote) as sum_vote').where("user_id <> 1").order('sum_vote desc').group(:reply_id).limit(1).first.try(:reply).try(:user)
    @fame_active = Reply.select('user_id, count(user_id) as replies_count').where("user_id <> 1").group(:user_id).order('replies_count desc').limit(1).first.try(:user)
    @fame_topics = Topic.select('user_id, count(user_id) as topics_count').where("user_id <> 1").group(:user_id).order('topics_count desc').limit(1).first.try(:user)
    @fame_points = ScoreBoard.select('user_id').where("user_id <> 1").order("current_points DESC").limit(1).first.try(:user)
  end
    
  def record_not_found
    render :file => "#{Rails.root}/public/404.#{I18n.locale}.html", :layout => false
  end

  # [Callback] sets locale or in the locale param or defaults to en
  def set_locale
    locale = request.subdomains.first
    locale = (logged_in? ?
              current_user.profile.language :
              browser_language) if locale.blank? || !I18n.available_locales.include?(locale.to_sym)
    I18n.locale = locale
  end

  def browser_language
    request.env['HTTP_ACCEPT_LANGUAGE'] =~ /ar/i ? 'ar' : 'en'
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
