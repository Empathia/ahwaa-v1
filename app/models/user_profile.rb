class UserProfile < ActiveRecord::Base
  belongs_to :user
  belongs_to :avatar

  validates_inclusion_of :language, :in => %w( en ar )
  validates_presence_of  :language
end
