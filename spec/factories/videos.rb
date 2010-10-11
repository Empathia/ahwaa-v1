# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :video do |f|
  f.association(:topic)
  f.source_url "http://www.youtube.com/watch?v=k7pv0cDVPz0"
end

Factory.define :youtube_video, :parent => :video do |f|
  f.source_url "http://www.youtube.com/watch?v=k7pv0cDVPz0"
end

Factory.define :vimeo_video, :parent => :video do |f|
  f.source_url "http://vimeo.com/15584910"
end
