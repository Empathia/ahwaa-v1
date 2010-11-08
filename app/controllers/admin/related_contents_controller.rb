class Admin::RelatedContentsController < ApplicationController

  layout 'admin'
  before_filter :get_topic
  respond_to :html
  respond_to :js, :only => :create

  def index
    @related_contents = @topic.related_contents
    @related_content = RelatedContent.new
  end

  def create
    @related_content = RelatedContent.build_from_url(params[:related_content].delete(:source_url), params[:related_content])
    if @related_content

      if @related_content.link? && @related_content.no_thumbnail_url?
        @related_content.scrape_link
        @possible_thumbnails = @related_content.possible_thumbnails
      else
        @related_content.topic = @topic
        if @related_content.save
          flash[:notice] = "#{@related_content.class.to_s} created"
        else
          flash[:alert] = @related_content.errors.full_messages.to_sentence
        end
      end
    else
      flash.now[:alert] = 'There has an error creating the related content'
    end

    respond_with(@related_content) do |format|
      format.html { redirect_to admin_topic_related_contents_path }
      format.js { render :flash => "The user was successfully created" }
    end
  end

  def new
    redirect_to :action => :index
  end

  def destroy
    @related_content = @topic.related_contents.find(params[:id])

    if @related_content.destroy
      flash[:notice] = "#{@related_content.class.to_s} deleted"
    else
      flash[:error] = 'There has an error deleting the related content'
    end
    redirect_to :action => :index
  end

  protected

    def get_topic
      @topic = Topic.find(params[:topic_id])
    end
end
