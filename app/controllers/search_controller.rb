class SearchController < ApplicationController
  skip_before_filter :authenticate_user!

  respond_to :json, :js

  def topics
    if logged_in?
      @results = Topic.where("title LIKE :input",{:input => "%#{params[:query]}%"}).reject{|k| current_user.blocks.map{|u| u.blocked_id}.include? k.user.id}
    else
      @results = Topic.where("title LIKE :input",{:input => "%#{params[:query]}%"}).paginate(:page => 1)
    end
    respond_with(@results)
  end

end
