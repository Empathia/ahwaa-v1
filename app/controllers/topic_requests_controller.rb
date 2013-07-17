class TopicRequestsController < ApplicationController

  def new
    @topic_request = TopicRequest.new
    render :layout => false;
  end

  def create
    params[:topic_request][:title].gsub!("<3", '@3')
    params[:topic_request][:title].gsub!('>:O', '@:O')
    @topic_request = current_user.topic_requests.new(params[:topic_request])

    if @topic_request.save
      @topic_request.vote!(current_user)
      User.notify_about_topic_request!(@topic_request)
      flash[:notice] = t('flash.topic_requests.create.notice')
    end

    redirect_to stream_path
  end
end
