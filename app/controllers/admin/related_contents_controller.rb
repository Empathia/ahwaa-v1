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
    url = params[:related_content].delete(:source_url)
    @related_content = RelatedContent.build_from_url(url, params[:related_content])
    if @related_content
      if @related_content.link? && @related_content.no_thumbnail_url?
        @related_content.scrape_link
        @possible_thumbnails = Fetchers::Link.get_possible_thumbnails(url)
      else
        @related_content.topic = @topic
        begin
          if @related_content.save
            flash[:notice] = "#{@related_content.class.to_s} created"
          else
            flash[:alert] = @related_content.errors.full_messages.to_sentence
          end
        rescue => detail
          flash[:alert] = 'There was an error creating the related content, please check the url is valid and try again'
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
