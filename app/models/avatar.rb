class Avatar < ActiveRecord::Base

  # TODO: attr_accessible
  
  has_many :user_profiles

  validates :url, :presence => true

  # [Class Method] gets an array of the avatars the given parameters
  # TODO: Some real logic is missing here!
  def self.get_matching_avatars_for_params(params)
    self.all.limit(5)
  end

  # Gets the default avatar
  def self.default
    find_or_create_by_url("/images/no-image.jpg")
  end

end
