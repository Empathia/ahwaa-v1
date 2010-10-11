class RioUtils
  # Downloads an external image to a local tmp file
  def self.download(url, binmode = true)
    img = binmode ? rio(url).binmode : rio(url)
    tmp = rio("#{Dir.tmpdir}/#{img.filename}")
    img > tmp
    File.open(tmp.path)
  end
end
