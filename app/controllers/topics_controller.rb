class TopicsController < ApplicationController
  skip_before_filter :authenticate_user!

  def show
    @topic = Topic.includes(:replies).find(params[:id])
    @replies = @topic.replies.group_by(&:contextual_index)
    @related_contents = @topic.related_contents
  end

  def tag
    @topics = params[:by_responses] ? Topic.by_replies_count(I18n.locale) : Topic.newest(I18n.locale)
    @topics = @topics.tagged_with(params[:tag]).in_groups_of(2, false)
  end

end
