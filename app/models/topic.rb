class Topic < ActiveRecord::Base
  acts_as_taggable

  # TODO: attr_accessible
  
  belongs_to :user
  has_many :replies, :dependent => :destroy

  validates :title, :presence => true
  validates :content, :presence => true
  validates :user_id, :presence => true
end
