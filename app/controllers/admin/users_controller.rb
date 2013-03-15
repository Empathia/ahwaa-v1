class Admin::UsersController < ApplicationController
  layout 'admin'

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

  def destroy
    @user = User.find(params[:id])
    debugger
    @user.destroy
    respond_with(@user, :location => [:admin, :users])
  end


end
