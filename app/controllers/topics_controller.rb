class TopicsController < ApplicationController
  skip_before_filter :authenticate_user!

  def show
    @topic = Topic.includes(:replies).find(params[:id])
    @replies = @topic.replies.group_by(&:contextual_index)
    @related_contents = @topic.related_contents
  end

  def tag
    @topics = Topic.tagged_with(params[:tag]).paginate(:page => params[:page])
  end

end
