class UserProfile < ActiveRecord::Base
  # TODO: attr_accessible
  
  belongs_to :user
  belongs_to :avatar

  validates_inclusion_of :language, :in => %w( en ar )
  validates_presence_of  :language

  before_create :set_default_avatar, :if => "avatar.nil?"
  before_create :set_default_language, :if => "language.nil?"
  private

    # Sets the default avatar for profile
    def set_default_avatar
      self.avatar = Avatar.default
    end

    def set_default_language
      self.language = 'en'
    end
end
