class RelatedContent < ActiveRecord::Base

  belongs_to :topic

  validates :topic_id, :presence => true
  validates :source_url, :presence => true,
    :uniqueness => { :scope => :topic_id }

# Builds an instance of the content based on its content type detected by the URL.
  def self.build_from_url(url, attrs = {})
    url.strip!
    url = "http://#{url}" unless /http:\/\/.*/ =~ url

    type = detect_type(url)
    type.new(attrs.merge(:source_url => url)) if type
  end

  # Detects the content type based on the url.
  def self.detect_type(url)
    return nil if !(UrlValidator::URL_REGEX =~ url) || !NetRequest.valid_url?(url)

    if is_a_video? url
      RelatedVideo
    elsif is_an_image? url
      RelatedImage
    else
      RelatedLink
    end
  end

  def css_class
    self.class.to_s.tableize.dasherize.singularize
  end

  # Returns true if content_type is a Link
  def link?
    is_a? RelatedLink
  end

  # Returns true if content_type is a Image
  def image?
    is_a? RelatedImage
  end

  # Returns true if content_type is a Video
  def video?
    is_a? RelatedVideo
  end


private

  # Detects if the Content-Type header of the url is an image
  # Or if the host is a known image hosting.
  #
  # == Valid image hostings:
  #
  # * twitpic.com
  # * flickr.com
  def self.is_an_image?(url)
    flickr_regex = /^https?:\/\/(?:www\.)?flickr\.com\/photos\/[-\w@]+\/\d+/i
    twitpic_regex = /^https?:\/\/(?:www\.)?twitpic\.com\/\w+/i
    img_regex = /\.(jpe?g|png|gif)$/i
    url =~ flickr_regex || url =~ twitpic_regex || url =~ img_regex
  end

  # Detects if the Content-Type header of the url is a video
  # Or if the host is a known video hosting.
  #
  # == Valid video hostings:
  #
  # * vimeo.com
  # * youtube.com
  def self.is_a_video?(url)
    yt_regex = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[^&]/i
    vimeo_regex = /^https?:\/\/(?:www\.)?vimeo\.com\/(?:.*#)?(\d+)/i
    url =~ yt_regex || url =~ vimeo_regex
  end

end
