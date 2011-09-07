class HomeController < ApplicationController
  skip_before_filter :authenticate_user!, :except => [:my_topics]

  def index
    redirect_to stream_path and return if logged_in?
    @popular = Topic.popular(I18n.locale)
    @latest = Topic.newest(I18n.locale).limit(5)
  end

  def stream
    redirect_to stream_path and return if current_user && params[:username] == current_user.username
    @user = params[:username] ? User.find_by_username(params[:username]) : current_user
    redirect_to root_path and return unless @user
    stream_users = @user.filtered_stream_users(params[:filter])
    @stream_messages = stream_users.page(params[:page]).per_page(15)
    @stream = @stream_messages.map(&:stream_message)
    if request.format == :html && !request.xhr?
      @recommended = @user == current_user ? @user.recommended_topics(5) : []
      @newest = Topic.newest(I18n.locale).limit(5)
    end

    respond_to do |format|
      format.html
      format.js
    end
  end

  def my_topics
    @topics = current_user.topics
    @user = current_user
  end

  def privacy_policy
  end

  def about
  end

  def terms
  end

end
