class RelatedLink < RelatedContent
  has_attached_file :thumbnail, :styles => { :original => "50x50#" }

  before_create :scrape_link

  attr_accessor :thumbnail_url

  def no_thumbnail_url?
    not @thumbnail_url
  end

  def scrape_link
    Fetchers::Link.scrape(source_url) do |response|
      self.title = response.title
      self.description = response.description
      self.thumbnail = RioUtils.download(URI.encode(@thumbnail_url || response.thumbnail_url))
    end
  end
end
