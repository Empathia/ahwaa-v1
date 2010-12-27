class HomeController < ApplicationController
  skip_before_filter :authenticate_user!

  def index
    @popular = Topic.popular(I18n.locale)
    @latest = Reply.latest(I18n.locale)
  end

  def privacy_policy
  end

  def about
  end

  def terms
  end

end
