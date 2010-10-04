class Topic < ActiveRecord::Base
  acts_as_taggable

  include Tanker

  tankit 'lgbt' do
    indexes :title
    indexes :content
    indexes :tag_list
  end

  belongs_to :user
  has_many :replies, :dependent => :destroy

  validates :title, :presence => true
  validates :content, :presence => true
  validates :user_id, :presence => true

  after_save :update_tank_indexes, :if => 'Rails.env == "production"'
  after_destroy :delete_tank_indexes, :if => 'Rails.env == "production"'

  def self.per_page
    5
  end

end
