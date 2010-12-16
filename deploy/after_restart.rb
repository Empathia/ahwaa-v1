env = node['environment']['framework_env']
current_path = "/data/transcend/current"
all_js = "#{current_path}/public/javascripts/all.js"

puts "Generating babilu locales for javascript"
run "cd #{current_path} && rake babilu:generate RAILS_ENV=#{env}"
run "rm #{all_js}" if ::File.exists?(all_js)

