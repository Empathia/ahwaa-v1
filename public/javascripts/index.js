$(function () {

    // preview video
    var player  = $('.video-player'),
        video   = player.find('.preview-video'),
        image   = player.find('.preview-image'),
        imageAnchor     = image.find('a'),
        videoIframe     = video.find('iframe'),
        isVideoInserted = false;

    video.hide();

    imageAnchor.bind('click', function (ev) {
        ev.preventDefault();
        console.log('show video');
        if ( !isVideoInserted ) {
            // do it just once
            isVideoInserted = true;
            videoIframe[0].src = videoIframe.data('src');
      		image.hide();
            video.show();
            imageAnchor.unbind('click');
        }
	});

});
