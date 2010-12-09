Class('RelatedContent')({

  URL_REGEX: /^((https?):\/\/)?([_a-z\d\-]+(\.[_a-z\d\-]+)+)(([_a-z\d\-\\.\/]+[_a-z\d\-\\\/])+)*/i,
  YT_REGEX: /^((https?):\/\/)?(?:www\.)?youtube\.com\/watch\?v=[^&]/i,
  VIMEO_REGEX: /^((https?):\/\/)?(?:www\.)?vimeo\.com\/(?:.*#)?(\d+)/i,
  FLICKR_REGEX: /^((https?):\/\/)?(?:www\.)?(?:flickr|twitpic)\.com\/photos\/[-\w@]+\/\d+/i,
  TWITPIC_REGEX: /^((https?):\/\/)?(?:www\.)?(?:twitpic)\.com\/\w+/i,
  IMGEXT_REGEX: /\.(jpe?g|png|gif)$/i,

  detectType: function(url, callback) {
    var contentType = 'link';

    if(this.YT_REGEX.test(url) || this.VIMEO_REGEX.test(url)) {
      contentType = 'video';
    } else if(this.isImage(url)) {
      contentType = 'image';
    }
    
    return contentType;
  },

  isImage: function(url) {
    return this.FLICKR_REGEX.test(url) ||
      this.TWITPIC_REGEX.test(url) ||
      this.IMGEXT_REGEX.test(url);
  },

})
