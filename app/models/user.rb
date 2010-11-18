class User < ActiveRecord::Base
  attr_accessor :password

  has_one :profile, :class_name => "UserProfile", :dependent => :destroy
  has_one :score_board,   :dependent => :destroy
  has_one :current_level, :through => :score_board, :class_name => "Level", :source => :level
  has_one :current_badge, :through => :score_board, :class_name => "Badge", :source => :badge
  has_one :current_prize, :through => :score_board, :class_name => "Prize", :source => :prize

  has_many :ratings, :dependent => :destroy
  has_many :rated_replies, :through => :ratings, :source => :reply
  has_many :private_messages, :dependent => :destroy,
    :foreign_key => :recipient_id, :conditions => {:parent_id => nil}
  has_many :topic_requests

  attr_accessible :username, :email, :password, :password_confirmation

  before_create :build_profile
  before_create :build_score_board
  before_validation :set_temp_password, :on => :create, :if => "password.blank?"
  before_save :set_encrypted_password, :if => :should_require_password?

  validates :username, :uniqueness => true, :presence => true,
    :format => { :with => /^[\w-]+$/ }
  validates :password, :confirmation => true,
    :presence => { :if => :should_require_password? }
  validates :email, :uniqueness => true, :email => true

  accepts_nested_attributes_for :profile

  def to_param
    username
  end
  
  # sets a prize badge or level or whatever reward model for the matter
  def set_reward(reward)
    self.send("current_#{reward.class.to_s.underscore}=",reward)
  end

  # Finds user by username or email
  def self.find_for_database_authentication(login_value)
    where(["username = :value OR email = :value", { :value => login_value }]).first
  end

  # Resets single access token for user
  def reset_single_access_token!
    update_attribute(:single_access_token, User.encrypt_token(Time.now.to_i, "password reset--"))
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

  def set_temp_password
    self.password = User.encrypt_token("temp_password", Time.now.to_i)[0...6]
  end

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
