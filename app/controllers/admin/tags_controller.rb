class Admin::TagsController < ApplicationController
  layout 'admin'
  respond_to :json

  def index
    @tags = if params[:format] == 'json'
      ActsAsTaggableOn::Tag.all.map{|tag| {'key' => tag.name, 'value' => tag.name}}
    else
      Topic.tag_counts
    end
    if params[:format] != 'json'
      @tags = @tags.order("position DESC")
    end
    respond_with @tags
  end

  def destroy
    @tag = ActsAsTaggableOn::Tag.find(params[:id])
    @tag.destroy
    respond_with(@tag, :location => [:admin, :tags])
  end

  def sort
    params[:acts_as_taggable_on_tag].each_with_index do |id, index|
      tag = ActsAsTaggableOn::Tag.find(id)
      tag.update_attribute(:position, index)
    end
    render :nothing => true
  end
end
