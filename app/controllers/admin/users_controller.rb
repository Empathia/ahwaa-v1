class Admin::UsersController < ApplicationController

  def index
    @users = User.paginate(:page => params[:page])
  end
  
  def toggle_expert
    @user = User.find(params[:id])
    if @user.toggle!(:is_expert)
      flash[:notice] = 'success'
    else
      flash[:error] = 'error'
    end
    redirect_to :action => "index"
  end
end
