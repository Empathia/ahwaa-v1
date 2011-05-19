class RepliesController < ApplicationController
  respond_to :js
  before_filter :find_topic
  skip_before_filter :authenticate_user!, :except => [:flag, :vote_up]

  def create
    @reply = @topic.replies.build(params[:reply])
    @reply.parent = @topic.replies.find(params[:reply_to]) unless params[:reply_to].blank?
    @reply.user = current_user if logged_in?
    @reply.save
    respond_to do |format|
      format.html {redirect_to @topic}
      format.js {respond_with(@reply)}
    end
  end

  def flag
    @reply = @topic.all_replies.find(params[:id])
    if @reply
      @flagged = !!@reply.flag!(current_user)
    end
  end

  def vote_up
    @reply = @topic.all_replies.find(params[:id])
    if @reply
      @voted = !!@reply.vote_up!(current_user)
    end
  end

  private

    def find_topic
      @topic = Topic.find(params[:topic_id])
    end
end
