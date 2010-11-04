$(function(){
    $('.topic-content > p').comments({color: '#FFFF00'});
    $('.related-content > div > ul').blockSlider();


    $('.send-private-msg').not('.disabled').click(function(){
        $(this).addClass('disabled').closest('.private-msg').children('form').slideDown();
    })                                                               

    $('.private-msg').find('.cancel').click(function(){
        $(this).closest('.private-msg').find('form').slideUp().end().find('.send-private-msg').removeClass('disabled');
    });
                                                                                                  
    $('.topic-experts').find('.avatar').mouseover(function(){
        $(this).siblings('.private-msg').fadeIn('fast').addClass('active-avatar');
    });

    $('.active-avatar').live('mouseleave', function(){
        $(this).fadeOut('fast');
    });

    /* The Browser Sniff is pending*/
    $('.add_comments > div > textarea').click(function(){
        $(this).css('color', '#6c6f74');
    });                                

    $('.add_comments > div > textarea').live('keypress', function(e){
        var textarea = $(this);
        e.keyCode == '13' && textarea.height(textarea.height() + 13);
    });

    var posX = Math.ceil(($(window).width() - 960)/2) - 30;
    $('.social-bookmarkers').css({'left' : posX + 'px', 'display' : 'block'}); 

    posX = Math.ceil(($(window).width() - 960)/2);
    $('aside').css({'right' : posX + 'px', 'display' : 'block'}); 
    
    $(window).resize(function() {
        posX = Math.ceil(($(window).width() - 960)/2) - 30;
        $('.social-bookmarkers').css({'left' : posX + 'px', 'display' : 'block'});
    
        posX = Math.ceil(($(window).width() - 960)/2);        
        $('aside').css({'right' : posX + 'px', 'display' : 'block'}); 
    });

    $('.form-private-msg').submit(function(){
        var _form = $(this);
        //Aqui va el ajax
        //If Success
        _form.prepend('<div class="success-validation border-all"><p>' + I18n.t('topics.show.sidebar.experts.message_sent') + '</p></div>');
        _form.delay(2000).slideUp(function(){
            _form.parent().find('.send-private-msg').removeClass('disabled').end().find('.success-validation').remove();
        });
        return false;
    });
});