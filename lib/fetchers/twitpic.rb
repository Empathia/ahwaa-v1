module Fetchers
  class InvalidTwitpicResponse < RuntimeError; end

  class Twitpic
    include HTTParty
    format :json

    attr_reader :title, :description, :thumbnail_url

    # Fetchs JSOn from twitpic API
    def self.parse(url)
      id = extract_id url
      url = "http://api.twitpic.com/2/media/show.json?id=#{id}"
      response = get(url)['message']
      unless response.blank?
        yield new(response, id)
      else
        raise InvalidTwitpicResponse
      end
    end

    # Gets the image id from the url
    def self.extract_id(url)
      url.scan(/twitpic\.com\/(.*)/).to_s
    end

    private

    def initialize(message, id)
      @title = @description = message
      @thumbnail_url = self.class.build_thumbnail_url id
    end

    def self.build_thumbnail_url(id)
      "http://twitpic.com/show/thumb/#{id}.jpg"
    end
  end
end
