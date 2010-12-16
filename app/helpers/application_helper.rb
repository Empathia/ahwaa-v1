module ApplicationHelper

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
    args.map! { |arg| arg.to_s }
    head { stylesheet_link_tag *args }
  end

  # small helper to DRY up printing flash messages
  def print_flash
    flash.collect do |key, msg|
      content_tag(:div, :class => "flash #{key}") do
        content_tag(:div, :class => "aligned") do
          msg
        end
      end
    end.join.html_safe
  end

  # Returns current user's username or string "Anonymous"
  def current_username
    logged_in? ? current_user.username : Reply.human_attribute_name(:anonymous)
  end
  
  # create avatar span
  def avatar_span(user, expert = false, level = true)
    css_classes = ['avatar']
    css_classes << 'expert' if expert
    css_classes << (level ? level_css_class_for_user(user) : 'no-level')
    content_tag(:span, :class => css_classes.join(' ') ) do
      image_tag(user.profile.avatar.url, :width => 56, :height => 56) + ( user.current_level || level ? content_tag(:span): '')
    end
  end

  # get acatar css for user
  def level_css_class_for_user(user)
    if user.current_level
      user.current_level.name.underscore.parameterize
    else
      'no-level'
    end
  end
end
