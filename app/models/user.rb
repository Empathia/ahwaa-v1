class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessible :email, :password, :password_confirmation, :remember_me
  has_one :profile, :class_name => "UserProfile", :dependent => :destroy

  attr_accessible :username, :email, :password, :password_confirmation

  before_create :build_profile

  validates :username, :uniqueness => true

  def self.find_for_authentication(conditions = {})
    conditions = ["username LIKE ? OR email LIKE ?", conditions[:username], conditions[:email]]
    super
  end
end
