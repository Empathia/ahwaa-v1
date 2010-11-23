class RelatedVideo < RelatedContent
  has_attached_file :thumbnail, :styles => { :original => "50x50#" }

  before_save :fetch_from_source

  # Wether the source url is from vimeo
  def from_vimeo?
    from?(:vimeo)
  end

  # Wether the source url is from youtube
  def from_youtube?
    from?(:youtube)
  end

  private

  # Fetchs data from video provider
  def fetch_from_source
    if from_vimeo?
      fetch(Fetchers::Vimeo)
    elsif from_youtube?
      fetch(Fetchers::Youtube)
    end
  end

  # Fetchs +title+, +description+ and +thumbnail+ from external API
  def fetch(strategy)
    strategy.parse(source_url) do |response|
      self.title = response.title if self.title.blank?
      self.description = response.description if self.description.blank?
      self.thumbnail = RioUtils.download(response.thumbnail_url)
    end
  end

  # Detects the source of the url
  def from?(source)
    case source_url
    when /^https?:\/\/(?:www\.)?youtube\.com*/
      :youtube == source
    when /^https?:\/\/(?:www\.)?vimeo\.com*/
      :vimeo == source
    end
  end
end
