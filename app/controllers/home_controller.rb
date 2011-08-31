class HomeController < ApplicationController
  skip_before_filter :authenticate_user!, :except => [:stream, :my_topics]

  def index
    redirect_to stream_path and return if logged_in?
    @popular = Topic.popular(I18n.locale)
    @latest = Topic.newest(I18n.locale).limit(5)
  end

  def stream
    @stream = if params[:filter] == 'followed'
      current_user.stream_users.followed
    elsif params[:filter] == 'owned'
      current_user.stream_users.owned
    else
      current_user.stream_users
    end
    @stream = @stream.order("created_at DESC").page(params[:page]).per_page(15).map(&:stream_message)
  end

  def my_topics
    @topics = current_user.topics
  end

  def privacy_policy
  end

  def about
  end

  def terms
  end

end
