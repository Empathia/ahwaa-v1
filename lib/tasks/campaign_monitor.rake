namespace :Campaign_monitor do
  desc "Populate the all listof campaign monitor"
  task :populate_lists => :environment do
    User.all.each do |user|
      print "\n#{user.id} - #{user.email} => "
      subscribed = CampaignMonitor.add_subscriber(user, 'all')
      print subscribed ? 'OK' : 'FAIL'
    end
  end

  desc "Update idle subscribers list (note: run after update_inactive)"
  task :update_idle => :environment do
    #Get users without replies nor topic requests
    users = User.idle

    # Remove users out the list returned
    users_emails = users.map(&:email)
    CampaignMonitor.get_subscribed_list('idle')['Results'].each do |subscriber|
      unless users_emails.include?(subscriber['EmailAddress'])
        user = User.find_by_email(subscriber['EmailAddress'])
        print "\n#{user.id} - #{user.email} => REMOVED"
        CampaignMonitor.remove_subscriber(user, 'idle')
      end
    end

    puts ">>> Updating #{users_emails.length} subscribers"

    # Add users
    users.each do |user|
      print "\n#{user.id} - #{user.email} => "
      unless CampaignMonitor.already_subscribed_to?(user, 'inactive')
        subscribed = CampaignMonitor.add_subscriber(user, 'idle')
      end
      print defined?(subscribed) && subscribed ? 'OK' : 'FAIL'
    end
  end

  desc "Update inactive subscribers list (note: run before update_idle)"
  task :update_inactive => :environment do
    #Get users without recent visited topics nor recent replies nor topic requests
    users = User.inactive

    # Remove users out the list returned
    users_emails = users.map(&:email)
    CampaignMonitor.get_subscribed_list('inactive')['Results'].each do |subscriber|
      unless users_emails.include?(subscriber['EmailAddress'])
        user = User.find_by_email(subscriber['EmailAddress'])
        print "\n#{user.id} - #{user.email} => REMOVED"
        CampaignMonitor.remove_subscriber(user, 'inactive')
      end
    end

    puts ">>> Updating #{users_emails.length} subscribers"

    # Add new users
    users.each do |user|
      print "\n#{user.id} - #{user.email} => "
      subscribed = CampaignMonitor.add_subscriber(user, 'inactive')
      print subscribed ? 'OK' : 'FAIL'
    end
  end
end
