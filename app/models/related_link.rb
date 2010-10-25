class RelatedLink < ActiveRecord::Base
  has_attached_file :thumbnail, :styles => { :original => "50x50#" }

  belongs_to :topic

  validates :topic_id, :presence => true
  validates :source_url, :presence => true,
    :uniqueness => { :scope => :topic_id }
  
  before_save :scrape_link

  private

  def scrape_link
    Fetchers::Link.scrape(source_url) do |response|
      self.title = response.title
      self.description = response.description
    end
  end
end
