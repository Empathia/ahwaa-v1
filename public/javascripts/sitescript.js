$(function(){
    $('.topic-content > p').comments({color: '#FFFF00'});
    $('.related-content > div > ul').blockSlider();
                                                                                                      
    function toggleSignUp(link, formName){        
        $('.sign-up > a').add('.over-form').removeClass('auth-form-active');                                                              
        link.addClass('auth-form-active');         
        if(!formName){
          formName = '.' + link.attr('id') + '-form';  
        }                                          
        console.log($(formName).html());
        $(formName).addClass('auth-form-active').offset({
            'left': link.offset().left,
            'top': link.offset().top + link.outerHeight()
            }
        );   
    }                
    
    
    $('.sign-up > a').click(function(){
        toggleSignUp($(this));
    });               
    
    $('#forgot-pass').click(function(){   
        toggleSignUp($('#login'), '.' + $(this).addClass('auth-form-active').attr('id') + '-form');       
    });
    
    $('.request-error a').click(function(){
        $(this).addClass('auth-form-active');
        toggleSignUp($('.sign-up > a:first-child'));
    })
    
    $('.send-private-msg').not('.disabled').click(function(){
        $(this).addClass('disabled').closest('.private-msg').children('form').slideDown();
    })                                                               
    
    $('.private-msg').find('.cancel').click(function(){
        $(this).closest('.private-msg').find('form').slideUp().end().find('.send-private-msg').removeClass('disabled');
    });
    
    $('.request-topic').click(function(e){
       var _btn = $(this);
       if(_btn.hasClass('disabled')){
           _btn.addClass('auth-form-active');
           var offset = _btn.offset();
           $('.request-error').addClass('auth-form-active').css({'top':offset.top+27, 'left':offset.left-39})
           e.preventDefault();
           return false;
       }
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
    
    $(document).click(function(e){                 
        !$(e.target).hasClass('auth-form-active') && !$(e.target).closest('.auth-form-active').length && $('.auth-form-active').removeClass('auth-form-active');
    });
    
    $('.cancel-forgot').click(function(){
        $('.auth-form-active').removeClass('auth-form-active');   
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
    
    $('.sign-up-form').submit(function(){
        $(this).find('.error').remove(); 
        
        //If Ajax request
        $('<p>').addClass('error').html(I18n.t('layouts.application.header.sign_up_form.error_username_not')).insertAfter('#user_username'); 
        return false;
    }).find('input[type=submit]').formValidator(
        {
            'errors': {  
                'email': I18n.t('layouts.application.header.sign_up_form.error_email_invalid'),
                'text': I18n.t('layouts.application.header.sign_up_form.error_username_empty')
            }
        }
    );
    
    $('.login-form').submit(function(){
        $(this).find('.error').remove(); 
        
        //If Ajax request and username is already registered
        $('<p>').addClass('error').html(I18n.t('layouts.application.header.sign_up_form.error_username_not')).insertAfter('#user_username'); 
        return false;
        
    }).find('input[type=submit]').formValidator(
        {
            'errors': {  
                'email': I18n.t('layouts.application.header.sign_up_form.error_email_invalid'),
                'password': I18n.t('layouts.application.header.sign_up_form.error_password_empty')
            }
        }   
    );

    $('.over-form').find('input').keyup(function(){
        var input = $(this);
        $.trim(input.val()) && input.next('.auth-form-error').remove();
    })
    
    $('.search').find('input').keyup(function(){
        var input = $(this);
        $.trim(input.val()) ? input.next().addClass('clear') : input.next().removeClass('clear');
    }).next().click(function(){
        var _magnify = $(this);
        _magnify.hasClass('clear') && _magnify.removeClass('clear') && _magnify.prev().val('').focus();
    });
});











