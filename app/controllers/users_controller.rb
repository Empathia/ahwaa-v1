class UsersController < ApplicationController
  respond_to :js, :only => [:update]
  respond_to :json, :only => [:create]
  before_filter :get_user
  skip_before_filter :authenticate_user!, :only => [:create]

  def show
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      UserMailer.sign_up_confirmation(@user).deliver
      session[:current_user] = @user.id 
    end
    respond_with(@user, :location => root_path)
  end

  def update
    # TODO: accept_nested_attributes_for :profile
    @user.update_attributes(params[:user])
    @submitted_form = params[:user][:profile_attributes] &&
      params[:user][:profile_attributes][:religion_id] ?
      'profile' : (params[:user][:password] ? 'password' : 'account')
  end

  def destroy
    sign_out_current_user
    @user.destroy
    respond_with(@user, :location => root_path)
  end

  protected

  def get_user
    @user = current_user
  end

end
