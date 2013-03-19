class SearchController < ApplicationController
  skip_before_filter :authenticate_user!

  respond_to :json, :js

  def topics
    @results = Topic.where("title LIKE :input",{:input => "%#{params[:query]}%"}).reject!{|k| current_user.blocks.map{|u| u.blocked_id}.include? k.user.id}
    respond_with(@results)
  end

end
