class Admin::FeaturedTopicsController < ApplicationController
  before_filter :authenticate_admin!
  layout 'admin'

  respond_to :json, :only => [:toggle]

  def index
    @topics = Topic.where(:featured => true).order("created_at DESC").paginate(:page => params[:page])
  end

  def toggle
    @topic = Topic.find(params[:id])
    @topic.featured = !@topic.featured
    @topic.save

    #respond_with(@topic)
    respond_to do |format|
      format.json { head :ok }
    end
  end
end
