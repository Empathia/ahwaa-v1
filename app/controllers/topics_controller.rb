class TopicsController < ApplicationController
  skip_before_filter :authenticate_user!, :except => [:follow, :unfollow]
  before_filter :find_topic, :only => [:follow, :unfollow]

  def show
    @topic = Topic.includes(:replies).find(params[:id])
    @content = @topic.content
    unless @content.match(/[.,?!;]\z/)
      @content = @content + "."
    end
    @admin = User.where(:is_admin => true).first
    @replies = @topic.replies.group_by(&:contextual_index)
    @meta_description = @topic.meta_description
    @meta_keywords = @topic.meta_keywords
    current_user.visit_topic!(@topic) if logged_in?
    @related_topics = @topic.related_topics.reject{|k| current_user.blocks.map{|u| u.block}.include? k.user}.first(4) if logged_in?
    @related_topics = @topic.related_topics.first(4) unless logged_in?
  end

  def related_content
    @topic = Topic.includes(:replies).find(params[:topic_id])
    @related_topics = @topic.related_topics.reject{|k| current_user.blocks.map{|u| u.block}.include? k.user} if logged_in?
    @related_topics = @topic.related_topics unless logged_in?
    render :layout => false
  end

  def tag
    @topics = params[:by_responses] ? Topic.by_replies_count(I18n.locale) : Topic.newest(I18n.locale)
    @tag = ActsAsTaggableOn::Tag.find(params[:tag])
    if logged_in?
      @topics = @topics.tagged_with(@tag).reject {|k| current_user.blocks.map{|u| u.blocked_id}.include? k.user.id}.in_groups_of(2, false)
    else
      @topics = @topics.tagged_with(@tag).in_groups_of(2, false)
    end
  end

  def follow
    current_user.subscribe_to(@topic) unless @topic.subscribed?(current_user)
    stream_message = @topic.stream_messages.last
    StreamUser.create(:user => current_user, :stream_message => stream_message, :source => 'followed') if stream_message
    redirect_to :back
  end

  def unfollow
    current_user.unsubscribe_from(@topic) if @topic.subscribed?(current_user)
    redirect_to :back
  end

  private

  def find_topic
    @topic = Topic.find(params[:id])
  end

end
