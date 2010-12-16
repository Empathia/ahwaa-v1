if Rails.env.production?
  current_path = "/data/transcend/current"
  shared_path = "/data/transcend/shared"
  shared_locales_js = "#{shared_path}/javascripts/locales.js"
  locales_js = "#{current_path}/public/javascripts/locales.js"
  all_js = "#{current_path}/public/javascripts/all.js"

  unless File.exists?(all_js)
    `"cp #{shared_locales_js} #{locales_js}"`
  end
end
