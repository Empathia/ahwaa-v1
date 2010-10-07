class TopicExpert < ActiveRecord::Base
  belongs_to :topic
  belongs_to :expert, :class_name => "User"
end
