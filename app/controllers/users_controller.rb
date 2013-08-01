class UsersController < ApplicationController
  respond_to :js, :only => [:update, :create]
  before_filter :get_user, :except =>[:profile]
  skip_before_filter :authenticate_user!, :only => [:profile, :create, :card]

  def show
  end

  def inbox
    @messages = @user.received_messages.group(:conversation_id).order('updated_at desc').paginate(:page => params[:page], :per_page => 100).all
  end

  def card
    @user = User.find(params[:user_id])
    render :layout => false
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      flash[:notice] = t('flash.users.create.notice')
      @user.notify_sign_up_confirmation! if @user && !@user.deleted?
    end
  end

  def update
    @user.update_attributes(params[:user])
  end

  def destroy
    sign_out_current_user
    @user.destroy
    respond_with(@user, :location => root_path)
  end

  def profile
    @user = User.find_by_username(params[:user_id])
    @topics = @user.topics.where('is_anonymous = false')
  end

  protected

  def get_user
    @user = current_user
  end

end
