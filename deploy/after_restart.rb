# env = node['environment']['framework_env']
# current_path = "/data/transcend/current"
# shared_path = "/data/transcend/shared"
# shared_locales_js = "#{shared_path}/javascripts/locales.js"
# locales_js = "#{current_path}/public/javascripts/locales.js"
# all_js = "#{current_path}/public/javascripts/all.js"
# 
# puts "Copying babilu locales for javascript"
# run "cp #{shared_locales_js} #{locales_js}"
# run "rm #{all_js}" if ::File.exists?(all_js)
# 
