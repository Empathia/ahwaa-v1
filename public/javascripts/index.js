$(function(){
	
    $('.watch-video a').overlay({href: '#watch-video-overlay'}).click(function(e){
		$('#pageslide-body-wrap').css('position', 'static');	
        $(this).trigger('clickOverlay');
    });
});
