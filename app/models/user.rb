class User < ActiveRecord::Base
  attr_accessor :password

  has_one :profile, :class_name => "UserProfile", :dependent => :destroy
  has_many :ratings, :dependent => :destroy
  has_many :rated_replies, :through => :ratings, :source => :reply
  has_many :private_messages, :dependent => :destroy,
    :foreign_key => :recipient_id, :conditions => {:parent_id => nil}

  attr_accessible :username, :email, :password, :password_confirmation

  before_create :build_profile
  before_save :set_encrypted_password, :if => :should_require_password?

  validates :username, :uniqueness => true, :presence => true
  validates :password, :confirmation => true,
    :presence => { :if => :should_require_password? }
  validates :email, :uniqueness => true, :email => true

  accepts_nested_attributes_for :profile

  def self.find_for_database_authentication(login_value)
    where(["username = :value OR email = :value", { :value => login_value }]).first
  end

  # Encrypts a string with a given salt
  def self.encrypt_token(token, salt)
    hash = salt
    10.times do |i|
      hash = Digest::SHA1.hexdigest([token, i, hash, salt].join)
    end
    hash
  end

  # Compares passed password with the one encrypted in the database
  def authenticate!(psw)
    User.encrypt_token(psw, password_salt) == encrypted_password
  end

  private

  def should_require_password?
    !password.blank? ||  encrypted_password.blank?
  end

  def set_password_salt
    self.password_salt = User.encrypt_token("hey there! #{rand(1000)}", Time.now.to_i)
  end

  def set_encrypted_password
    set_password_salt if password_salt.blank?
    self.encrypted_password = User.encrypt_token(password, password_salt)
  end

end
