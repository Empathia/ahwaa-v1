$(function(){
    $('article > p').comments({color: '#FFFF00'});
    $('.related-content > div > ul').blockSlider();
                                                                                                      
    function toggleSignUp(link){        
        $('.sign-up > a').add('.over-form').removeClass('active');                                                              
        link.addClass('active');
        $('.' + link.attr('id') + '-form').addClass('active').offset({
            'left': link.offset().left,
            'top': link.offset().top + link.outerHeight()
            }
        );
    }       
    $('.sign-up > a').click(function(){
        toggleSignUp($(this));
    });               
    
    $('.request-error a').click(function(){
        $(this).addClass('active');
        toggleSignUp($('.sign-up > a:first-child'));
    })
    

    $('.request-topic').click(function(){
       var _btn = $(this);               
       _btn.addClass('active');
       var offset = _btn.offset();
       $('.request-error').addClass('active').css({'top':offset.top+27, 'left':offset.left-39})
    });
    
    $('.topic-experts .avatar').click(function(){
 
    });
    
    $(document).click(function(e){                 
        !$(e.target).hasClass('active') && !$(e.target).closest('.active').length && $('.active').removeClass('active');
    });                                                                                                             
    
    var posX = Math.ceil(($(window).width() - 960)/2) - 44;
    $('.social-bookmarkers').css({'left' : posX + 'px', 'display' : 'block'}); 
    
    posX = Math.ceil(($(window).width() - 960)/2);
    $('aside').css({'right' : posX + 'px', 'display' : 'block'}); 
        
    $(window).resize(function() {
        posX = Math.ceil(($(window).width() - 960)/2) - 44;
        $('.social-bookmarkers').css({'left' : posX + 'px', 'display' : 'block'});
        
        posX = Math.ceil(($(window).width() - 960)/2);        
        $('aside').css({'right' : posX + 'px', 'display' : 'block'}); 
    });
});