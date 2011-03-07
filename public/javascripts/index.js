$(function(){
    $('.watch-video').overlay({href: '#watch-video-overlay'}).click(function(e){
        $(this).trigger('clickOverlay');
    });
});
