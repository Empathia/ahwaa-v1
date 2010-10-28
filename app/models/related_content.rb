class RelatedContent < ActiveRecord::Base

  belongs_to :topic

  validates :topic_id, :presence => true
  validates :source_url, :presence => true,
    :uniqueness => { :scope => :topic_id }
end
