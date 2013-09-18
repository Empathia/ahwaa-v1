class Admin::UsersController < ApplicationController
  before_filter :authenticate_admin!
  layout 'admin'

  def index
    if params[:search]
      @users = User.find_all_by_username(params[:search])
    else
      @users = User.paginate(:page => params[:page])
    end
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

  def toggle_mod
    @user = User.find(params[:id])
    if @user.toggle!(:is_mod)
      flash[:notice] = 'success'
    else
      flash[:error] = 'error'
    end
    redirect_to :back rescue redirect_to :action => "index"
  end

  def search_users
    @users = User.order(:username).where("username like ?", "%#{params[:term]}%")
    render :json => @users.map(&:username)
  end

  def destroy
    @user = User.find(params[:id])
    if @user.deleted?
      @user.deleted = false
      @user.email = @user.old_email
      @user.save(false)
    else
      @user.reload.topics.map{|topic| topic.update_attribute(:is_anonymous, true)}
      old = @user.email.dup
      @user.deleted = true
      @user.email = Time.now.to_i.to_s + "@ahwaa.org"
      @user.old_email = old
      @user.save(false)
    end
    #@user.destroy
    respond_with(@user, :location => [:admin, :users])
  end


end
