class UserMailer < ActionMailer::Base
  default :from => "no-reply@trascends.com"

  def sign_up_confirmation(user)
    @user = user
    mail :to => @user.email,
      :subject => "Welcome to Transcend"
  end

  def password_reset(user)
    @user = user
    mail :to => @user.email,
      :subject => "Password reset"
  end
end
