namespace :babilu do
  desc "generates locales.js"
  task :generate => :environment do
    Babilu.generate
  end
end
