module Fetchers
  class Raw
    attr_reader :title, :description, :thumbnail_url

    def self.parse(url)
      path = Pathname.new(url)
      yield new(url)
    end

    private

    def initialize(thumbnail_url)
      @title = @description = ""
      @thumbnail_url = thumbnail_url
    end
  end
end
