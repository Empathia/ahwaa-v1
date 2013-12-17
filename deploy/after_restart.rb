# ==============================================================================
# SETUP
# ==============================================================================
cmd_prefix = "GEM_HOME=#{status.gem_home} RAILS_ENV=#{node.environment.framework_env}"
pid_dir    = '/data/ahwaa/shared/tmp/pids'
pid_file   = 'tmp/pids/resque_worker_QUEUE.pid'

# ==============================================================================
# CREATE PIDS DIR ONLY IF IT DOES NOT EXIST
# ==============================================================================
directory pid_dir do
  owner app[:user]
  group app[:user]
  mode 0777
  always_run true
end

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

execute 'Installing cron jobs' do
  always_run true
  owner app[:user]
  path release_path
  command "#{cmd_prefix} whenever --load-file cron/schedule.rb -w"
end

execute "Remove all.js file" do
  always_run true
  owner app[:user]
  path release_path
  command "rm -f public/javascripts/all.js"
end

execute 'Generate foreman environment file' do
  always_run true
  owner app[:user]
  path current_path
  command "/bin/sh -l -c 'echo \"#{cmd_prefix.split(' ').join('\n')}\" > .env'"
end

execute 'Run foreman to generate upstart services' do
  always_run true
  owner app[:user]
  path current_path
  command "/bin/sh -l -c 'sudo foreman export upstart /etc/init -a ahwaa -l /data/ahwaa/current/log -u deploy'"
end

execute 'Stop resque jobs' do
  always_run true
  owner app[:user]
  path current_path
  command "/bin/sh -l -c 'sudo stop ahwaa'"
end

execute 'Start resque jobs' do
  always_run true
  owner app[:user]
  path current_path
  command "/bin/sh -l -c 'sudo start ahwaa'"
end

# Node server, left in two steps to commit start command

# execute 'stop node server' do
#   always_run true
#   owner app[:user]
#   path current_path
#   command "daemon -n node_server --stop"
# end

execute 'start node server' do
  always_run true
  owner app[:user]
  path current_path
  command "daemon -n node_server -e 'NODE_ENV=#{node.environment.framework_env}' -- node #{current_path}/chat_server.js"
end

# Delayed job is used to send emails in background for subscribers
# execute "Start delayed jobs." do
#   always_run true
#   owner app[:user]
#   path release_path
#   command "#{cmd_prefix} script/delayed_job start"
# end
