require 'open-uri'

module Fetchers
  class InvalidLinkAddress < RuntimeError; end

  class Link
    attr_reader :title, :description, :thumbnail_url, :possible_thumbnails

    def self.scrape(url)
      begin
        doc = Nokogiri::HTML(open(URI.encode(url)))
        yield new(url, doc)
      rescue SocketError, Errno::ENOENT, URI::InvalidURIError
        raise InvalidLinkAddress
      end
    end

    def self.get_possible_thumbnails(url)
      scrape(url){ |response| return response.possible_thumbnails}
    end

    private

    def initialize(url, doc)
      @uri = URI(URI.encode(url))
      @doc = doc
      @title = find_title
      @description = find_description
      @possible_thumbnails = thumbnails
      @thumbnail_url = @possible_thumbnails.first
    end

    def thumbnails
      image = @doc.at_css("meta[@property='og:image']") || image_src
      return [image[:content]] if image
      all_images
    end

    def all_images
      @doc.search('img').map do |img|
        expand_relative_path(img.attribute('src').content) unless img.attribute('src').nil?
      end.flatten
    end

    # Url full path generator
    #
    # Adds the root of the url if the path relative
    #
    def expand_relative_path(path)
      path = URI(URI.encode path.strip)
      return path.to_s if path.absolute?
      URI.join("#{@uri.scheme}://#{@uri.host}", path.path).to_s
    end

    def image_src
      tag = @doc.at_css("link[@rel='image_src']")
      tag['href'] if tag
    end

    def find_title
      @doc.at_css('title').content.strip
    end

    def find_description
      desc = @doc.at_css("meta[@property='og:description']") ||
        @doc.at_css("meta[@name='description']")
      desc = desc.nil? || desc.attr('content').blank? ? from_markup : desc.attr('content')
      desc[0..255]
    end

    def from_markup
      title = @doc.at_css('body h1')
      title.nil? ? clean_body : title.text
    end

    # Sanitize html, removes comments, new lines, tabs and extra spaces
    def clean_body
      html = @doc.at_css('body').inner_html.gsub(/<\s*script\b[^>]*>.*?<\s*\/\s*script\s*>/im, '')
      html.gsub!(/(?:<|&lt;)!--.*?->/im, '')
      html = Nokogiri::HTML(html).text # Twice to convert escaped html entities
      html.gsub!(/[\t\n\r]+/i, ' ')
      html.gsub!(/\s{2,}/, ' ')
      html
    end
  end
end
