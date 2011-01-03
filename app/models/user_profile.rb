class UserProfile < ActiveRecord::Base
  # TODO: attr_accessible
  
  belongs_to :user
  belongs_to :avatar
  belongs_to :religion
  belongs_to :gender
  belongs_to :sexual_orientation
  belongs_to :age
  belongs_to :country
  belongs_to :political_view

  validates_inclusion_of :language, :in => %w( en ar )
  validates_presence_of  :language

  before_create :set_default_avatar, :if => "avatar.nil?"
  before_create :set_default_language, :if => "language.nil?"

  def self.get_matching_profiles_from_params(params)
    UserProfile.where(params.reject{ |k, v| v == 'all' })
  end
  
  def empty?
    !religion && !sexual_orientation && !country &&
      !gender && !age && !political_view
  end

  def i18n_language
    UserProfile.human_attribute_name(language)
  end

  private

  # Sets the default avatar for profile
  def set_default_avatar
    self.avatar = Avatar.default
  end

  def set_default_language
    self.language = 'en'
  end
end
