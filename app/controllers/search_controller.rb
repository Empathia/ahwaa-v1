class SearchController < ApplicationController
  skip_before_filter :authenticate_user!

  respond_to :json

  def topics
    respond_with(@results = Topic.search_tank(params[:query]))
  end

end
