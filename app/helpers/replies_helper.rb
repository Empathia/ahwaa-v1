module RepliesHelper

  # Builds link for voting up depending of current conditions
  def link_to_vote_up(reply)
    enabled = logged_in? && !reply.voted_by?(current_user)
    text = reply.voted_by?(current_user) ? t('shared.useful_flag_buttons.already_useful') : t("shared.useful_flag_buttons.useful")
    url = enabled ? vote_up_topic_reply_path(reply.topic, reply, :format => :js) : '#'
    options = { :class => "btn-gradient useful-lk #{'disabled' unless enabled}" }
    if enabled
      options[:remote] = true
      options[:'data-method'] = :post
      options[:'data-id'] = reply.id
    end
    link_to text, url, options
  end

  # Builds link for flagging depending of current conditions
  def link_to_flag(reply)
    enabled = logged_in? && !reply.flagged_by?(current_user)
    text = reply.flagged_by?(current_user) ? t('shared.useful_flag_buttons.already_flagged') : t("shared.useful_flag_buttons.flag")
    url = enabled ? flag_topic_reply_path(reply.topic, reply, :format => :js) : '#'
    options = { :class => "btn-gradient flag #{'disabled' unless enabled}" }
    if enabled
      options[:remote] = true
      options[:'data-method'] = :post
      options[:'data-id'] = reply.id
    end
    link_to content_tag(:span, text), url, options
  end
end
