class Admin::FeaturedTopicsController < ApplicationController
  layout 'admin'

  respond_to :json, :only => [:toggle]

  def index
    @topics = Topic.where(:featured => true).order("created_at DESC").paginate(:page => params[:page])
  end

  def toggle
    @topic = Topic.find(params[:id])
    @topic.featured = !@topic.featured
    @topic.save

    respond_with(@topic)
  end
end
