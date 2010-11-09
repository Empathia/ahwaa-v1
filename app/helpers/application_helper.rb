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
      content_tag(:div, {:class => "flash #{key}"}, true) do
        msg
      end
    end.join.html_safe
  end

end
