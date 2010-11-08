class RelatedLink < RelatedContent
  has_attached_file :thumbnail, :styles => { :original => "50x50#" }

  before_save :scrape_link

  attr_accessor :thumbnail_url
  attr_reader   :possible_thumbnails

  def no_thumbnail_url?
    not @thumbnail_url
  end

  def scrape_link
    Fetchers::Link.scrape(source_url) do |response|
      @possible_thumbnails = response.possible_thumbnails
      self.title = response.title
      self.description = response.description
      self.thumbnail = RioUtils.download(@thumbnail_url || response.thumbnail_url)
    end
  end
end
