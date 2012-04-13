class SearchController < ApplicationController
  skip_before_filter :authenticate_user!

  respond_to :json, :js

  def topics
    @results = Topic.where("title LIKE :input",{:input => "%#{params[:query]}%"}).paginate(:page => 1)
    respond_with(@results)
  end

end
