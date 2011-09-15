cmd_prefix = "GEM_HOME=#{status.gem_home} RAILS_ENV=#{node.environment.framework_env}"

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

