class Admin::TopicRequestsController < ApplicationController
  layout 'admin'

  before_filter :get_topic_request, :except => [:index]

  def index
    @topic_requests = TopicRequest.most_voted.paginate(:page => params[:page])
  end

  # deletes the topic request and redirects to the create topic form
  # if the user requested anonymity the user_id is not passed
  def promote_to_topic
    if @topic_request.destroy
      flash[:notice] == t('flash.actions.destroy.notice')
    else
      flash[:alert] == t('flash.actions.destroy.alert')
    end

    options = {:topic => {
      :title => @topic_request.title,
      :content => @topic_request.content
    }}

    unless @topic_request.annonymous_post
      options[:topic][:user_id] = @topic_request.user_id
    end

    redirect_to new_admin_topic_path(options)
  end

  def destroy
    @topic_request.destroy
    respond_with(@topic_request, :location => [:admin, :topic_requests])
  end

  protected

  def get_topic_request
    @topic_request = TopicRequest.find(params[:id])
  end
end
