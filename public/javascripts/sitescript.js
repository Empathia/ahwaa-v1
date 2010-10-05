$(function(){
    $('article > p').comments({color: '#FFFF00'});
    $('.related-content > div > ul').blockSlider();
    $('.sign-up > a').click(function(){
        $('.sign-up > a').add('.over-form').removeClass('active');
        var link = $(this);
        link.addClass('active');
        $('.' + link.attr('id') + '-form').addClass('active').offset({
            'left': link.offset().left,
            'top': link.offset().top + link.outerHeight()
            }
        );
    });  
    
    $(document).click(function(e){                 
        !$(e.target).hasClass('active') && !$(e.target).closest('.active').length && $('.sign-up > a').add('.over-form').removeClass('active');
    });                                                                                                             
    
    var posX = Math.ceil(($(window).width() - 960)/2) - 44;
    $('.social-bookmarkers').css({'left' : posX + 'px', 'display' : 'block'}); 
    
    posX = Math.ceil(($(window).width() - 960)/2);
    $('aside').css({'right' : posX + 'px', 'display' : 'block'}); 
        
    $(window).resize(function() {
        posX = Math.ceil(($(window).width() - 960)/2) - 44;
        $('.social-bookmarkers').css({'left' : posX + 'px', 'display' : 'block'});
    });
});