require 'open-uri'

module Fetchers
  class InvalidLinkAddress < RuntimeError; end

  class Link
    attr_reader :title, :description, :thumbnail_url

    def self.scrape(url)
      begin
        doc = Nokogiri::HTML(open(url))
        yield new(doc)
      rescue SocketError, Errno::ENOENT, URI::InvalidURIError
        raise InvalidLinkAddress
      end
    end

    private

    def initialize(doc)
      @doc = doc
      @title = find_title
      @description = find_description
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
