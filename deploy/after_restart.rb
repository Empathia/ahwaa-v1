env = node['environment']['framework_env']
current_path = "/data/transcend/current"

puts "Generating babilu locales for javascript"
run "cd #{current_path} && rake babilu:generate RAILS_ENV=#{env}"
run "rm #{current_path}/public/javascripts/all.js"

