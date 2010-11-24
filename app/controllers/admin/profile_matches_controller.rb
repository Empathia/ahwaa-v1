class Admin::ProfileMatchesController < ApplicationController
  layout 'admin'

  before_filter :get_topic
  
  def show
  end

  def list_matches
    @profiles = UserProfile.where(params[:filters]).select('user_id')
    @users = User.find(@profiles.map(&:user_id)) 
  end

  def notify
  end

private

  def get_topic
    @topic = Topic.find(params[:topic_id])
  end
end
