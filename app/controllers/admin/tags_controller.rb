class Admin::TagsController < ApplicationController
  layout 'admin'
  respond_to :json

  def index
    @tags = ActsAsTaggableOn::Tag.all.map{|tag| {'key' => tag.name, 'value' => tag.name}}
    respond_with @tags
  end
end
