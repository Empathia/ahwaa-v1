class CampaignMonitor
  @@campaign = nil

  def self.add_subscriber(user, list, custom_fields = nil)
    load
    list_id = self.get_list_id(list)
    CreateSend::Subscriber.add(list_id, user.email, user.username, custom_fields, true) unless already_subscribed_to?(user, list)
  end

  def self.remove_subscriber(user, list)
    load
    list_id = self.get_list_id(list)
    if already_subscribed_to?(user, list)
      list = CreateSend::Subscriber.new(list_id, user.email)
      list.delete
    end
  end

  def self.already_subscribed_to?(user, list)
    load
    list_id = self.get_list_id(list)
    begin
      CreateSend::Subscriber.get(list_id, user.email)
    rescue CreateSend::BadRequest => err
      # Code 203: Subscriber not in list or has already been removed.
      if err.data.Code == 203
        false
      else
        raise err
      end
    end
  end

  def self.get_subscribed_list(list)
    load
    list_id = self.get_list_id(list)
    list = CreateSend::List.new(list_id)
    list.active(Date.today.to_s)
  end

  private
  def self.load
    unless @@campaign
      puts "Initializing Campaign Monitor....."
      CreateSend.api_key APP_CONFIG['campaign_monitor']['key']
      @@campaign = CreateSend::CreateSend.new
    end
    @@campaign
  end

  def self.get_list_id(list)
    APP_CONFIG['campaign_monitor']['lists'][list]
  end
end
