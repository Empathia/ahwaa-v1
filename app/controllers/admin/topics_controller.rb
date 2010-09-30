class Admin::TopicsController < ApplicationController
  before_filter :find_topic, :only => [:edit, :update, :destroy]

  def index
    @topics = Topic.paginate(:page => params[:page])
  end

  def new
    @topic = Topic.new
  end

  def create
    @topic = Topic.new(params[:topic])
    if @topic.save
      redirect_to admin_topics_path, :notice => "flash.admin.topics.create.success"
    else
      render "new"
    end
  end

  def edit
  end

  def update
    if @topic.update_attributes(params[:topic])
      redirect_to admin_topics_path, :notice => "flash.admin.topics.update.success"
    else
      render "edit"
    end
  end

  def destroy
    @topic.destroy
    redirect_to admin_topics_path, :notice => "flash.admin.topics.destroy.success"
  end

  private

  def find_topic
    @topic = Topic.find(params[:id])
  end
end
