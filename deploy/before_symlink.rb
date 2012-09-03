cmd_prefix = "GEM_HOME=#{status.gem_home} RAILS_ENV=#{node.environment.framework_env}"

# if ::File.exist? "#{current_path}/tmp/pids/delayed_job.pid"
#   execute 'Stop delayed jobs, only if pid file is found.' do
#     always_run true
#     owner app[:user]
#     path current_path
#     command "#{cmd_prefix} script/delayed_job stop"
#   end
# end

[
  ["#{release_path}/tmp/pids", "#{shared_path}pids"],
  ["#{release_path}/log", "#{shared_path}log"]
].each do |source, dest|
  directory dest do
    owner app[:user]
    group app[:user]
    mode 0777
    always_run true
  end
  link source do
    to dest
    owner app[:user]
    group app[:user]
    always_run true
  end
end

