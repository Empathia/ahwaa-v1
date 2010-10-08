$(function(){
    $('.topic-content > p').comments({color: '#FFFF00'});
    $('.related-content > div > ul').blockSlider();
                                                                                                      
    function toggleSignUp(link){        
        $('.sign-up > a').add('.over-form').removeClass('auth-form-active');                                                              
        link.addClass('auth-form-active');
        $('.' + link.attr('id') + '-form').addClass('auth-form-active').offset({
            'left': link.offset().left,
            'top': link.offset().top + link.outerHeight()
            }
        );
    }       
    $('.sign-up > a').click(function(){
        toggleSignUp($(this));
    });               
    
    $('.request-error a').click(function(){
        $(this).addClass('auth-form-active');
        toggleSignUp($('.sign-up > a:first-child'));
    })
    

    $('.request-topic').click(function(){
       var _btn = $(this);               
       _btn.addClass('auth-form-active');
       var offset = _btn.offset();
       $('.request-error').addClass('auth-form-active').css({'top':offset.top+27, 'left':offset.left-39})
    });
    
    $('.topic-experts .avatar').click(function(){
 
    });
    
    $(document).click(function(e){                 
        !$(e.target).hasClass('auth-form-active') && !$(e.target).closest('.auth-form-active').length && $('.auth-form-active').removeClass('auth-form-active');
    });                                                                                                             
    
    var posX = Math.ceil(($(window).width() - 960)/2) - 36;
    $('.social-bookmarkers').css({'left' : posX + 'px', 'display' : 'block'}); 
    
    posX = Math.ceil(($(window).width() - 960)/2);
    $('aside').css({'right' : posX + 'px', 'display' : 'block'}); 
        
    $(window).resize(function() {
        posX = Math.ceil(($(window).width() - 960)/2) - 36;
        $('.social-bookmarkers').css({'left' : posX + 'px', 'display' : 'block'});
        
        posX = Math.ceil(($(window).width() - 960)/2);        
        $('aside').css({'right' : posX + 'px', 'display' : 'block'}); 
    });
});