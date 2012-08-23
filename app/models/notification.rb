class Notification < ActiveRecord::Base
  belongs_to :sender, :class_name => "User", :foreign_key => "sender_id"
  belongs_to :receiver, :class_name => "User", :foreign_key => "receiver_id"
  belongs_to :topic
  belongs_to :private_message

  CATEGORIES = %w[thanks welcome]

  attr_accessor :include_message
  attr_accessible :receiver_id, :topic_id, :content, :category, :include_message
  attr_protected :sender_id, :private_message_id

  scope :thanked_by, lambda{|user_id, topic_id| where(:sender_id => user_id, :topic_id => topic_id, :category => 'thanks')}
  scope :welcomed_by, lambda{|user_id, receiver_id| where(:sender_id => user_id, :receiver_id => receiver_id, :category => 'welcome')}
  scope :unread, where(:read => false)

  def title
    if category == 'thanks'
      I18n.t('private_message.thanked_title')
    else
      I18n.t('private_message.welcome_title')
    end
  end
end
