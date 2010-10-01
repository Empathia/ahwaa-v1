class RepliesController < ApplicationController
  respond_to :html, :json
  before_filter :find_topic
  skip_before_filter :authenticate_user!

  def create
    @reply = @topic.replies.build(params[:reply])
    @reply.user = current_user if user_signed_in?
    bk = lambda do |format|
      format.html { redirect_to @topic, :alert => t("flash.actions.create.alert") }
    end unless @reply.save
    respond_with(@reply, :location => @topic, &bk)
  end

  private

    def find_topic
      @topic = Topic.find(params[:topic_id])
    end
end
