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
    if @user.deleted?
      @user.deleted = false
      @user.email = @user.old_email
      @user.save
    else
      old = @user.email.dup
      @user.deleted = true
      @user.email = Time.now.to_i.to_s + "@ahwaa.org"
      @user.old_email = old
      @user.save
    end
    #@user.destroy
    respond_with(@user, :location => [:admin, :users])
  end


end
