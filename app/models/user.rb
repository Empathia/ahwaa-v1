class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessible :email, :password, :password_confirmation, :remember_me
  has_one :profile, :class_name => "UserProfile", :dependent => :destroy

  attr_accessible :username, :email, :password, :password_confirmation

  before_create :build_profile

  validates :username, :uniqueness => true, :presence => true

  accepts_nested_attributes_for :profile

  def self.find_for_database_authentication(conditions)
    value = conditions[authentication_keys.first]
    where(["username = :value OR email = :value", { :value => value }]).first
  end

end
