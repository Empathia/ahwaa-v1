class HomeController < ApplicationController
  skip_before_filter :authenticate_user!

  def index
    @popular = Topic.popular
    @latest = Reply.latest
  end

  def privacy_policy
  end

  def about
  end

  def terms
  end

end
