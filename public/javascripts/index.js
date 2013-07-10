$(function () {

    // VIDEO
    var player  = $('.video-player'),
        autoplay = true,
        video   = player.find('.preview-video'),
        image   = player.find('.preview-image'),
        imageAnchor     = image.find('a'),
        videoIframe     = video.find('iframe');

    video.hide();

    imageAnchor.bind('click', function (ev) {
        var videoSrc = videoIframe.data('src') + ((autoplay) ? "&autoplay=1" : "");
        videoIframe[0].src = videoSrc;
  		image.hide();
        video.show();
        imageAnchor.unbind('click');
        return false;
	});

});
