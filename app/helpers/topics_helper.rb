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
      # TODO: add topic_tag_url
      content_tag :span, link_to(tag, "/topics/#{tag}")
    end.join(", ").html_safe
  end
end
