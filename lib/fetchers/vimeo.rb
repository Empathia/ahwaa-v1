module Fetchers
  class InvalidVimeoResponse < RuntimeError; end

  class Vimeo
    include HTTParty
    format :json

    attr_reader :title, :description, :thumbnail_url

    # Fetchs json from Vimeo API
    def self.parse(url)
      url = "http://vimeo.com/api/v2/video/#{extract_id url}.json"
      response = get(url)[0]
      if response
        yield new(response['title'],
                  response['description'],
                  response['thumbnail_small'])
      else
        raise InvalidVimeoResponse
      end
    end

    # Gets the video id from the url
    def self.extract_id(url)
      url.scan(/(?:.*#)?(\d+)/).to_s
    end

    private

    def initialize(title, description, thumbnail_url)
      @description = description.gsub(/<\/?[^>]*>/, '')
      @title, @thumbnail_url = title, thumbnail_url
    end
  end
end
