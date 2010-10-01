class RepliesController < ApplicationController
  skip_before_filter :authenticate_user!

  def create
    @topic = Topic.find(params[:topic_id])
    @reply = @topic.replies.build(params[:reply])
    @reply.user = current_user if user_signed_in?
    respond_to do |format|
      if @reply.save
        format.html { redirect_to @topic, :notice => t("flash.replies.create.success") }
        format.json { render :json => @reply, :status => 201 }
      else
        format.html { redirect_to @topic, :notice => t("flash.replies.create.fail") }
        format.json { render :json => @reply.errors, :status => 409 }
      end
    end
  end
end
