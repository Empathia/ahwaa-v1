class Admin::TopicRequestsController < ApplicationController
  layout 'admin'

  before_filter :get_topic_request, :except => [:index]

  def index
    @topic_requests = TopicRequest.most_voted.paginate(:page => params[:page])
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
