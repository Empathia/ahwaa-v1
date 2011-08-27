class HomeController < ApplicationController
  skip_before_filter :authenticate_user!

  def index
    redirect_to stream_path and return if logged_in?
    @popular = Topic.popular(I18n.locale)
    @latest = Reply.latest(I18n.locale)
  end

  def stream
  end

  def privacy_policy
  end

  def about
  end

  def terms
  end

end
