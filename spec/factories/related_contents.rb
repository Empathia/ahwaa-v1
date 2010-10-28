# ========== Images

Factory.define :related_image do |f|
  f.source_url "http://www.flickr.com/photos/anasilva/5038885831/in/photostream/"
  f.association(:topic)
end

Factory.define :flickr_image, :parent => :related_image do |f|
  f.source_url "http://www.flickr.com/photos/anasilva/5038885831"
end

Factory.define :twitpic_image, :parent => :related_image do |f|
  f.source_url "http://twitpic.com/2wrxo7"
end

Factory.define :raw_image, :parent => :related_image do |f|
  f.source_url "http://www.diamondvues.com/archives/Ruby%20Gemstone.jpg"
end

# =========== Links

Factory.define :related_link do |f|
  f.association(:topic)
  f.source_url "http://www.elpais.com/articulo/internacional/Gobierno/chileno/quiere/tener/minero/superficie/acabe/dia/elpepuint/20101012elpepuint_9/Tes"
end

# ============ Videos

Factory.define :related_video do |f|
  f.association(:topic)
  f.source_url "http://www.youtube.com/watch?v=k7pv0cDVPz0"
end

Factory.define :youtube_video, :parent => :related_video do |f|
  f.source_url "http://www.youtube.com/watch?v=k7pv0cDVPz0"
end

Factory.define :vimeo_video, :parent => :related_video do |f|
  f.source_url "http://vimeo.com/15584910"
end
