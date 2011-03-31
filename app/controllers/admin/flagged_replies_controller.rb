class Admin::FlaggedRepliesController < ApplicationController
  before_filter :find_reply, :only => [:destroy, :unflag]

  layout 'admin'

  def index
    @flags = Reply.flagged.paginate(:page => params[:page])
  end

  def unflag
    @reply.flags.clear
    respond_with(@reply, :location => [:admin, :flagged_replies])
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
