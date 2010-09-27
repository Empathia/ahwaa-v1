class Avatar < ActiveRecord::Base

  has_many :user_profiles

  # [Class Method] gets an array of the avatars the given parameters
  # TODO: Some real logic is missing here!
  def self.get_matching_avatars_for_params(params)
    self.all.limit(5)
  end

end
