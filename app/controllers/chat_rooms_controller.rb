class ChatRoomsController < ApplicationController
  before_filter :validate_user_points, :only => [:create]

  def create
    @chat_room = current_user.chat_rooms.create(params[:chat_room])
    unless params[:chat_room][:invites] == ""
        params[:chat_room][:invites].split(',').each do |user|
          @chat_room.chat_invites.create({:user_id => user.to_i, :inviter => current_user.username})
        end
    end

    if params[:chat_room][:private] == 'true'
      @chat_room.room_users.create({:user_id => current_user.id})
      unless params[:chat_room][:invites] == ""
        params[:chat_room][:invites].split(',').each do |user|
          @chat_room.room_users.create({:user_id => user.to_i})
        end
      end
    end

    respond_to do |format|
      format.json { render :json => @chat_room }
    end
  end

  def update
    @chat_room = ChatRoom.find(params[:id])

    if @chat_room.private == true
      @room_user = @chat_room.room_users.find_by_user_id(params[:user_id])
      @room_user.destroy
    else
      @chat_room.room_users.create({:user_id => params[:user_id]})
    end
    render :nothing => true
  end

  def destroy
    @chat_room = ChatRoom.find(params[:id])

    if current_user == @chat_room.user || current_user.is_mod = true
      @chat_room.destroy
      @response = true
    else
      @response = false
    end

    respond_to do |format|
      format.json { render :json => @response }
    end
  end

  def destroy_chat
    @chat_room = ChatRoom.find(params[:id])
    @chat_room.destroy
    @response = true

    respond_to do |format|
      format.json { render :json => @response }
    end
  end

  def mark_as_read
    @invite = ChatInvite.find(params[:id])
    @invite.checked = true
    @invite.save
    render :nothing => true
  end

  def create_invite
    @chat_room = ChatRoom.find(params[:room_id])

    params[:invites].split(',').each do |user|
      @chat_room.chat_invites.create({:user_id => user.to_i, :inviter => current_user.username})
    end

    if @chat_room.private == true
      params[:invites].split(',').each do |user|
        @chat_room.room_users.create({:user_id => user.to_i})
      end
    end

    @response = {}
    @response['is_private'] = @chat_room.private

    respond_to do |format|
      format.json { render :json => @response }
    end

  end

  def is_user_allow
    @user = User.find(params[:user_id])
    @chat_room = ChatRoom.find(params[:room_id])

    @present = @chat_room.room_users.select { |item| item[:user_id] == @user.id }

    if @present.length > 0
      @response = true
    else
      @response = false
    end

    respond_to do |format|
      format.json { render :json => @response }
    end
  end

  def chat_disclosure
    @disclosure = current_user.create_chat_disclosure
    render :nothing => true
  end

  private

    def validate_user_points
      points = current_user.score_board.current_points
      if points > 499
        true
      else
        false
      end
    end
end
