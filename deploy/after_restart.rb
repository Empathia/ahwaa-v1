cmd_prefix = "GEM_HOME=#{status.gem_home} RAILS_ENV=#{node.environment.framework_env}"

execute "Generate babilu js files" do
  always_run true
  owner app[:user]
  path release_path
  command "#{cmd_prefix} rake babilu:generate"
end

execute "Copy generated I18n files" do
  always_run true
  owner app[:user]
  path release_path
  command "cp /data/ahwaa/shared/javascripts/locales.js public/javascripts/locales.js"
end

execute "Remove all.js file" do
  always_run true
  owner app[:user]
  path release_path
  command "rm -f public/javascripts/all.js"
end

