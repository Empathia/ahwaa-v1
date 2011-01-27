class UserMailer < ActionMailer::Base
  default :from => "no-reply@ahwaa.org"

  def sign_up_confirmation(user)
    @user = user
    mail :to => @user.email,
      :subject => I18n.t('mailers.user.sign_up_confirmation.subject')
  end

  def password_reset(user)
    @user = user
    mail :to => @user.email,
      :subject => I18n.t('mailers.user.password_reset.subject')
  end

  def private_message_notification(user, sender)
    @user = user
    @sender = sender
    mail :to => @user.email,
      :subject => I18n.t('mailers.user.private_message_notification.subject')
  end

  def topic_match_notification(user, topic)
    @user = user
    @topic = topic
    mail(:to => @user.email,
         :subject => I18n.t('mailers.user.topic_match_notification.subject'))
  end

  def topic_request_notification(user, topic_request)
    @user = user
    @topic_request = topic_request
    mail :to => @user.email,
      :subject => I18n.t('mailers.user.topic_request_notification.subject')
  end
end
