class Avatar < ActiveRecord::Base

  # TODO: attr_accessible
  
  has_many :user_profiles
  belongs_to :gender
  belongs_to :age
  validates :url, :presence => true, :uniqueness => true

  # [Class Method] gets an array of the avatars the given parameters
  def self.get_matching_avatars_for_params(params)
    filters = params.symbolize_keys
    filters.delete(:gender_id) if filters[:gender_id].blank? || 
      !Gender.ids_for_male_and_female_entries.include?(filters[:gender_id].to_i)
    filters.delete(:age_id) if filters[:age_id].blank? 

    self.where(filters)
  end

  # Gets the default avatar
  def self.default
    find_or_create_by_url("/images/no-image.jpg")
  end

end
