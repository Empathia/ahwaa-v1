class BlocksController < ApplicationController
  def create
    @block = current_user.blocks.build(:blocked_id => params[:blocked_id])
    if @block.save
      flash[:notice] = "User Blocked."
      redirect_to root_url
    else
      flash[:error] = "Unable to block user."
      redirect_to root_url
    end
  end

  def destroy
    @unlocked = current_user.blocks.find_by_blocked_id(params[:blocked_id])
    @unlocked.destroy
    flash[:notice] = "Removed block."
    redirect_to root_url
  end
end
