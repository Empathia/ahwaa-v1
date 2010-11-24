class UserMailer < ActionMailer::Base
  default :from => "no-reply@transcend.com"

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

  def private_message_notification(user, sender)
    @user = user
    @sender = sender
    mail :to => @user.email,
      :subject => "You've received a private message"
  end

  def topic_match_notification(user, topic)
    @user = user
    @topic = topic
    mail(:to => @user.email,
         :subject => I18n.t('mailers.user.topic_match_notification.subject'))
  end
end
