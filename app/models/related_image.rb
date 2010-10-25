class RelatedImage < ActiveRecord::Base
  has_attached_file :thumbnail

  belongs_to :topic

  validates :topic_id, :presence => true
  validates :source_url, :presence => true,
    :uniqueness => { :scope => :topic_id }

  before_save :fetch_from_source

  # Wether or not the url is from flickr.
  def from_flickr?
    from?(:flickr)
  end

  # Wether or note the url is from twitpic
  def from_twitpic?
    from?(:twitpic)
  end

  # Wether or note the url is from a direct link
  def from_raw?
    from?(:raw)
  end

  private

  # Detects the source of the url
  def from?(source)
    case source_url
    when /^https?:\/\/(?:www\.)?twitpic\.com*/
      :twitpic == source
    when /^https?:\/\/(?:www\.)?flickr\.com*/
      :flickr == source
    when /\.(jpe?g|png|gif|bmp)(?:[^\/]+)?$/i
      :raw == source
    end
  end

  # Fetchs data from image provider
  def fetch_from_source
    if from_flickr?
      flickr_fetcher = Fetchers::Flickr.new(APP_CONFIG['flickr_api_key'])
      fetch(flickr_fetcher)
    elsif from_twitpic?
      fetch(Fetchers::Twitpic)
    elsif from_raw?
      fetch(Fetchers::Raw)
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
end
