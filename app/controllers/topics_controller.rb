class TopicsController < ApplicationController
  skip_before_filter :authenticate_user!

  def show
    @topic = Topic.find(params[:id])
  end

end
