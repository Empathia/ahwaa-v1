class HomeController < ApplicationController
  skip_before_filter :authenticate_user!, :except => [:stream, :my_topics]

  def index
    redirect_to stream_path and return if logged_in?
    @popular = Topic.popular(I18n.locale)
    @latest = Topic.newest(I18n.locale).limit(5)
  end

  def stream
    stream_users = current_user.filtered_stream_users(params[:filter])
    @stream_messages = stream_users.page(params[:page]).per_page(1)
    @stream = @stream_messages.map(&:stream_message)
    if request.format == :html && !request.xhr?
      @recommended = current_user.recommended_topics(5)
      @newest = Topic.newest(I18n.locale).limit(5)
    end

    respond_to do |format|
      format.html
      format.js
    end
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
