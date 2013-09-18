class Admin::FlaggedRepliesController < ApplicationController
  before_filter :authenticate_mod!
  before_filter :find_reply, :only => [:destroy, :unflag]

  layout 'admin'

  def index
    @flags = Reply.flagged.paginate(:page => params[:page])
  end

  def unflag
    @reply.flags.clear
    respond_with(@reply, :location => [:admin, :flagged_replies])
  end

  def bulk_update
    if params[:delete]
      params[:replies].each do |id|
        reply = Reply.find(id)
        reply.destroy
      end
    elsif params[:unflag]
      params[:replies].each do |id|
        reply = Reply.find(id)
        reply.flags.clear
      end
    end
    redirect_to :back rescue redirect_to :action => "index"
  end

  def destroy
    @reply.destroy
    respond_with(@reply, :location => [:admin, :flagged_replies])
  end

  private

  def find_reply
    @reply = Reply.find(params[:id])
  end
end
