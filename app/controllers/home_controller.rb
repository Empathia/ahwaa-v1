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
    stream_users = @user.filtered_stream_users(params[:filter], I18n.locale)

    @users_similar_profile = User.suggestions_with_similar_profile(current_user.profile)
    similar_topics_ids = Topic.of_interest_for(current_user)
    @users_similar_interests = similar_topics_ids.empty? ? [] : User.suggestions_with_similar_topics(current_user, similar_topics_ids.join(',') )

    if request.format == :html && !request.xhr?
      @recommended = @user == current_user ? @user.recommended_topics(5) : []
      @newest = Topic.newest(I18n.locale).limit(5)
    end

    if params[:filter] == 'featured'
      @stream_messages = Topic.featured.page(params[:page]).per_page(15)
      @stream = @stream_messages.map{ |topic| topic.stream_messages.last }
    else
      notifications = Notification.where(:receiver_id => current_user.id, :content => nil).limit(5)
      @stream_messages = stream_users.page(params[:page]).per_page(15)
      @stream = @stream_messages.map(&:stream_message)
      @stream = (@stream + notifications).compact.sort{|a,b| b.created_at <=> a.created_at }
    end

    @stream_for_new_users = []
    # For new users get the recommended a newest topic stream messages
    if @stream.empty? && @user.new_user? && params[:filter] != 'owned'
      @stream_for_new_users = [@recommended, @newest].flatten.compact.map{|t| t.stream_messages.last }.compact.sort{|a,b| b.created_at <=> a.created_at }
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
