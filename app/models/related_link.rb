class RelatedLink < RelatedContent
  has_attached_file :thumbnail, :styles => { :original => "50x50#" }

  before_save :scrape_link

  private

  def scrape_link
    Fetchers::Link.scrape(source_url) do |response|
      self.title = response.title
      self.description = response.description
      self.thumbnail = RioUtils.download(response.thumbnail_url)
    end
  end
end
