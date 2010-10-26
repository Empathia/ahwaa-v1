# Read about factories at http://github.com/thoughtbot/factory_girl

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
