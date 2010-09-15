class User < ActiveRecord::Base
  has_one :profile, :class_name => "UserProfile", :dependent => :destroy

  attr_accessible :username, :email, :password, :password_confirmation
  attr_accessor :password

  before_create :build_profile
  before_save :set_encrypted_password, :if => :should_require_password?

  validates :password, :confirmation => true, :presence => true
  validates :password_confirmation, :presence => true
  validates :username, :uniqueness => true
  validates :email, :uniqueness => true, :email => true

  # Compares passed password with the user's one encrypted
  def authenticate(password)
    User.encrypt_password(password, password_salt) == encrypted_password
  end

  # Encrypts a string with a given salt
  def self.encrypt_password(str, salt)
    token = salt
    10.times do |i|
      token = Digest::SHA1.hexdigest([str, i, token, salt].join)
    end
    token
  end

  private

  def should_require_password?
    !password.blank? || encrypted_password.blank?
  end

  def set_password_salt
    self.password_salt = User.encrypt_password("hey there! #{rand(1000)}", Time.now.to_i)
  end

  def set_encrypted_password
    set_password_salt if password_salt.blank?
    self.encrypted_password = User.encrypt_password(password, password_salt)
  end
end
