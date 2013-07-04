$(function() {
    // preview video
    var player = $('.video-player'),
        video = player.find('.preview-video'),
        image = player.find('.preview-image');

    video.hide();
    image.find('a').bind('click', function (ev) {
        ev.preventDefault();
  		image.hide();
        video.show();
	});
});
