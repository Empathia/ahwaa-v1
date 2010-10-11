class Video < ActiveRecord::Base
  has_attached_file :thumbnail

  belongs_to :topic

  validates :topic_id, :presence => true
  validates :source_url, :presence => true,
    :uniqueness => { :scope => :topic_id }

  before_save :fetch_from_source

  # Wether the source url is from vimeo
  def from_vimeo?
    from(:vimeo)
  end

  # Wether the source url is from youtube
  def from_youtube?
    from(:youtube)
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
      self.title = response.title
      self.description = response.description
      self.thumbnail = RioUtils.download(response.thumbnail_url)
    end
  end

  # Detects the source of the url
  def from(source)
    case source_url
    when /^https?:\/\/(?:www\.)?youtube\.com*/
      :youtube == source
    when /^https?:\/\/(?:www\.)?vimeo\.com*/
      :vimeo == source
    end
  end
end
