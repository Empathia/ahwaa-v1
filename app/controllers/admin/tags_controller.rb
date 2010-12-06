class Admin::TagsController < ApplicationController
  layout 'admin'
  respond_to :json

  def index
    @tags = if params[:format] == 'json'
      ActsAsTaggableOn::Tag.all.map{|tag| {'key' => tag.name, 'value' => tag.name}}
    else
      Topic.tag_counts
    end
    respond_with @tags
  end

  def destroy
    @tag = ActsAsTaggableOn::Tag.find(params[:id])
    @tag.destroy
    respond_with(@tag, :location => [:admin, :tags])
  end
end
