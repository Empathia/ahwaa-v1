class RepliesController < ApplicationController
  respond_to :json, :except => [:create]
  respond_to :js, :only => [:create]
  before_filter :find_topic
  skip_before_filter :authenticate_user!, :except => [:flag, :vote_up]

  def create
    @reply = @topic.replies.build(params[:reply])
    @reply.parent = @topic.replies.find(params[:reply_to]) if params[:reply_to]
    @reply.user = current_user if logged_in?
    @reply.save
  end

  def flag
    @reply = @topic.all_replies.find(params[:reply_id])
    if @reply
      @flag = @reply.flag!(current_user)
      respond_with(@flag, :location => @topic)
    else
      respond_with(@reply, :location => @topic)
    end
  end

  def vote_up
    @reply = @topic.all_replies.find(params[:reply_id])
    if @reply
      @vote = @reply.vote_up!(current_user)
      respond_with(@vote, :location => @topic)
    else
      respond_with(@reply, :location => @topic)
    end
  end

  private

    def find_topic
      @topic = Topic.find(params[:topic_id])
    end
end
