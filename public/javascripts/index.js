$(function(){
    $('.watch-video a').overlay({href: '#watch-video-overlay'}).click(function(e){
        $('#pageslide-body-wrap').css('position', 'static');
        $(this).trigger('clickOverlay');
    });

    $('.video-player .preview-video').hide();
    $('.video-player .preview-image > a').bind('mousedown', function() {
  		$(this).parent().hide().siblings('.preview-video').show();
	});
});