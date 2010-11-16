class RepliesController < ApplicationController
  respond_to :json
  before_filter :find_topic
  skip_before_filter :authenticate_user!, :except => [:flag, :vote_up]

  def create
    @reply = @topic.replies.build(params[:reply])
    @reply.user = current_user if logged_in?
    @reply.save
    respond_with(@reply, :location => @topic)
  end

  def flag
    @reply = @topic.all_replies.find(params[:reply_id])
    @flag = @reply.flag!(current_user) if @reply
    respond_with(@flag, :location => @topic)
  end

  def vote_up
    @reply = @topic.all_replies.find(params[:reply_id])
    @vote = @reply.vote_up!(current_user) if @reply
    respond_with(@vote, :location => @topic)
  end

  private

    def find_topic
      @topic = Topic.find(params[:topic_id])
    end
end
