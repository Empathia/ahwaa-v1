# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :related_link do |f|
  f.association(:topic)
  f.source_url "http://www.elpais.com/articulo/internacional/Gobierno/chileno/quiere/tener/minero/superficie/acabe/dia/elpepuint/20101012elpepuint_9/Tes"
end
