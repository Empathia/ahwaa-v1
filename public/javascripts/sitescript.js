$(function(){
    $('article > p').comments({color: '#FFFF00'});
    $('.experts-carrousel > ul').blockSlider();
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
});