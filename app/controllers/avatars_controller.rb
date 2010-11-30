class AvatarsController < ApplicationController
  
  respond_to :js, :only => [:matches]

  def matches
    Avatar.get_matching_avatars_for_params(params[:filters])
  end

end
