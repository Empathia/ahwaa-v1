class TopicRequestsController < ApplicationController

  def new
    @topic_request = TopicRequest.new
  end

  def create
    @topic_request = current_user.topic_requests.new(params[:topic_request])

    if @topic_request.save
      @topic_request.vote!(current_user)
      flash[:notice] == t('flash.actions.destroy.notice')
    else
      flash[:alert] == t('flash.actions.destroy.alert')
    end

    redirect_to '/'
  end
end
