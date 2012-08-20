if !Rails.env.production?
  ActionMailer::Base.delivery_method = :smtp
  ActionMailer::Base.smtp_settings = {
    :user_name => "lgbt",
    :password => "4eebfdaa63683435",
    :address => "mailtrap.io",
    :port => 2525,
    :authentication => :plain,
  }
end
