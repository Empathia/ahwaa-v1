module Fetchers
  class InvalidFlickrResponse < RuntimeError; end

  class Flickr
    include HTTParty
    format :xml

    attr_reader :title, :description, :thumbnail_url

    # Fetchs XML from flickr API
    def parse(url)
      url = "http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&photo_id=#{self.class.extract_id url}&api_key=#{@api_key}"
      response = self.class.get(url)['rsp']
      unless response['err']
        yield load(response['photo'])
      else
        raise InvalidFlickrResponse
      end
    end

    # Gets the image id from the url
    def self.extract_id(url)
      url.scan(/\/photos\/.*\/(\d+)(?:\/.*)?$/).to_s
    end

    def initialize(api_key)
      @api_key = api_key
    end

    private

    def load(photo)
      @title, @description = photo['title'], photo['description']
      @thumbnail_url = self.class.build_thumbnail_url(photo['farm'],
                                          photo['server'],
                                          photo['id'], photo['secret'])
      self
    end

    # Builds thumbnail url from photo attributes
    def self.build_thumbnail_url(farm, server, id, secret)
      "http://farm#{farm}.static.flickr.com/#{server}/#{id}_#{secret}.jpg"
    end
  end
end
