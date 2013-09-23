module ApplicationHelper
  def title(title)
    @page_title = title
  end

  def page_description(description)
    @page_description = description.scan(/.{1,150}\b/).first.strip
  end

  # Wraps content to display within the +<head>+ tags
  def head(&block)
    content_for(:head) { block.call }
  end

  # Include javascript files within the +<head>+ tags
  def javascript(*args)
    args = args.map { |arg| arg == :defaults ? arg : arg.to_s }
    head { javascript_include_tag *args }
  end

  # Include stylesheet files within the +<head>+ tags
  def stylesheet(*args)
    args.map! { |arg|
      rtl? ? "rtl/#{arg}_rtl" : arg.to_s
    }
    head { stylesheet_link_tag *args }
  end

  # small helper to DRY up printing flash messages
  def print_flash
    flash.collect do |key, msg|
      content_tag(:div, :class => "flash #{key}") do
        content_tag(:div) do
          content_tag(:div) do
            msg
          end
        end
      end
    end.join.html_safe
  end

  # Returns current user's username or string "Anonymous"
  def current_username
    logged_in? ? current_user.username : Reply.human_attribute_name(:anonymous)
  end

  # create avatar span
  def avatar_span(user, expert = false, level = true, size = "56x56")
    css_classes = ['avatar']
    css_classes << 'expert' if expert
    css_classes << 'new' if user.new_user?
    css_classes << (level ? level_css_class_for_user(user) : 'no-level')
    content_tag(:span, :class => css_classes.join(' ') ) do
      image_tag(user.profile.avatar.url, :size => size) + (content_tag(:em) if user.new_user?) + ( user.current_level || level ? content_tag(:span): '')
    end
  end

  # get acatar css for user
  def level_css_class_for_user(user)
    if user && user.current_level
      user.current_level.name.underscore.parameterize
    else
      'no-level'
    end
  end
  def truncate_html(input, *args)
    require "rexml/parsers/pullparser"
    # support both 2.2 & earlier APIs
    options = args.extract_options!
    length = options[:length] || args[0] || 30
    omission = options[:omission] || args[1] || '&hellip;'

    begin
      parser = REXML::Parsers::PullParser.new(input)
      encoder = HTMLEntities.new(TruncateHtmlHelper.flavor)
      tags, output, chars_remaining = [], '', length

      while parser.has_next? && chars_remaining > 0
        element = parser.pull
        case element.event_type
        when :start_element
          output << rexml_element_to_tag(element)
          tags.push element[0]
        when :end_element
          output << "</#{tags.pop}>"
        when :text
          text = encoder.decode(element[0])
          output << encoder.encode(text.first(chars_remaining))
          chars_remaining -= text.length
          output << omission if chars_remaining < 0
        end
      end

      tags.reverse.each {|tag| output << "</#{tag}>" }
      output

    rescue REXML::ParseException => e
      fixed_up = Nokogiri::HTML.fragment(input).to_html
      raise ::TruncateHtmlHelper::InvalidHtml, "Could not fixup invalid html. #{e.message}" if fixed_up == input
      input = fixed_up
      retry
    end
  end
  def rexml_element_to_tag(element)
    "<#{element[0]}#{element[1].inject(""){|m,(k,v)| m << %{ #{k}="#{v}"}} unless element[1].empty?}>"
  end
end
