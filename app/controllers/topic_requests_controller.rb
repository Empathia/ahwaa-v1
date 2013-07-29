class TopicRequestsController < ApplicationController

  def new
    @topic_request = TopicRequest.new
    render :layout => false;
  end

  def create
    params[:topic_request][:original_title] = params[:topic_request][:title].dup
    params[:topic_request][:original_content] = params[:topic_request][:content].dup
    emoticons(params[:topic_request][:title])
    emoticons(params[:topic_request][:content])
    @topic_request = current_user.topic_requests.new(params[:topic_request])
    if @topic_request.save
      @topic_request.vote!(current_user)
      User.notify_about_topic_request!(@topic_request)
      flash[:notice] = t('flash.topic_requests.create.notice')
    end


    redirect_to stream_path
  end
end
