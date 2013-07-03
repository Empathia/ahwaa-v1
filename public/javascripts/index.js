$(function(){
    $('.video-player .preview-video').hide();
    $('.video-player .preview-image > a').bind('mousedown', function() {
  		$(this).parent().hide().siblings('.preview-video').show();
	});
});
