class RepliesController < ApplicationController
  respond_to :json
  before_filter :find_topic
  skip_before_filter :authenticate_user!

  def create
    @reply = @topic.replies.build(params[:reply])
    @reply.user = current_user if logged_in?
    @reply.save
    respond_with(@reply, :location => @topic)
  end

  private

    def find_topic
      @topic = Topic.find(params[:topic_id])
    end
end
