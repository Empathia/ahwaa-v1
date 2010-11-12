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
        msg
      end
    end.join.html_safe
  end

  # Returns current user's username or string "Anonymous"
  def current_username
    logged_in? ? current_user.username : Reply.human_attribute_name(:anonymous)
  end

end
