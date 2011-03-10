module TopicsHelper
  # Builds linked_in share url
  def linked_in_share_url(topic)
    qs = {
      :mini => true,
      :url => topic_url(topic),
      :title => topic.title,
      :source => root_url
    }
    "http://www.linkedin.com/shareArticle?#{qs.to_param}"
  end

  # Builds facebook share url
  def facebook_share_url(topic)
    qs = {
      :u => topic_url(topic),
      :t => topic.title
    }
    "http://www.facebook.com/sharer.php?#{qs.to_param}"
  end

  # Builds twitter share url
  def twitter_share_url(topic)
    qs = {
      :status => "#{topic.title} - #{topic_url(topic)}"
    }
    "http://twitter.com/home?#{qs.to_param}"
  end

  # Converts the string array of tags to an array of links
  def linked_tag_list(tags)
    tags.map do |tag|
      content_tag :span, link_to(tag, topic_tag_path(tag.id))
    end.join(", ").html_safe
  end

  # Set active class if currently in the page
  def active_class(by_responses = false)
    'active' if !!params[:by_responses] == by_responses
  end

  # Sets css class for topic's response type, wether it's first or last button
  def response_type_border_class(index)
    index == 0 ? 'border-left' : (index == Reply::CATEGORIES.length-1 ? 'border-right' : '')
  end

  # Builds css classes for reply
  def reply_css_classes(reply)
    "#{("expert" if reply.from_expert?)} #{reply.category} #{'useful' if reply.useful?}"
  end
end
