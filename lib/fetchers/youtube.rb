module Fetchers
  class InvalidYoutubeResponse < RuntimeError; end

  class Youtube
    include HTTParty
    format :xml

    attr_reader :title, :description, :thumbnail_url

    # Fetchs xml from YouTube API
    def self.parse(url)
      url = "http://gdata.youtube.com/feeds/api/videos/#{extract_id url}"
      response = get(url)['entry']
      if response
        yield new(response['title'],
                  response['media:group']['media:description'],
                  response['media:group']['media:thumbnail'].first['url'])
      else
        raise InvalidYoutubeResponse
      end
    end

    # Gets the video id from the url
    def self.extract_id(url)
      url.scan(/v=([^&]*)/).to_s
    end

    private

    def initialize(title, description, thumbnail_url)
      @title, @description, @thumbnail_url = title, description, thumbnail_url
    end
  end
end
