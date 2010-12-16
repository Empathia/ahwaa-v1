env = node['environment']['framework_env']

puts "Generating babilu locales for javascript"
run "rake babilu:generate RAILS_ENV=#{env}"
run "rm public/javascripts/all.js"

