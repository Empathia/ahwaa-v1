class Admin::FlaggedRepliesController < ApplicationController

  layout 'admin'

  def index
    @flags = Reply.flagged.paginate(:page => params[:page])
  end

  def destroy
    @reply = Reply.find(params[:id])
    @reply.destroy
    respond_with(@reply, :location => [:admin, :flagged_replies])
  end
end
