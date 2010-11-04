$(function(){        
       
    function toggleSignUp(link, formName){        
        $('.auth-wrapper > a').add('.over-form').removeClass('auth-form-active');                                                              
        link.addClass('auth-form-active');         
        if(!formName){
          formName = '.' + link.attr('id') + '-form';  
        }     
        $(formName).addClass('auth-form-active').offset({
            'left': link.offset().left,
            'top': link.offset().top + link.outerHeight() - 1
            }
        );   
    }                
    
    $('.auth-wrapper > a').click(function(){
        toggleSignUp($(this));
    });               
    
    $('#forgot-pass').click(function(){        
        $('#forgot-pass').addClass('auth-form-active');
        toggleSignUp($('#login'), '.' + $(this).attr('id') + '-form');       
    });
    
    $('.request-error').find('a').click(function(){
        var btn = $(this);
        btn.addClass('auth-form-active').closest('.request-error').removeClass('auth-form-active');
        toggleSignUp($('#sign-up'));         

    });
    
    $('.request-topic').click(function(e){
       var _btn = $(this);   
       if(_btn.hasClass('disabled')){
           _btn.addClass('auth-form-active');
           $('.auth-form-active').removeClass('auth-form-active');
           var offset = _btn.offset();
           $('.request-error').addClass('auth-form-active').css({'top':offset.top+27, 'left':offset.left-39})
           e.preventDefault();
           return false;
       }
    });
    
    $(document).click(function(e){                 
        !$(e.target).hasClass('auth-form-active') && !$(e.target).closest('.auth-form-active').length && $('.auth-form-active').removeClass('auth-form-active');
    });
    
    $('.cancel-forgot').click(function(){
        $('.auth-form-active').removeClass('auth-form-active');   
    });
    
    $('.sign-up-form').submit(function(){
        var that = $(this);
        that.find('.error').remove(); 
        
        $.ajax({
            url: this.action,
            dataType: 'json',
            type: 'post',
            data: $(this).serialize(),
            success: function (data) {
                location.reload();
            },
            error: function (data) {
                data = eval('(' + data.responseText + ')');
                for (var attr in data) {
                    var wrapper = that.find('.' + attr);
                    if(wrapper.length === 0) {
                        wrapper = that.find('.errors');
                    }
                    wrapper.append('<p class="error">' + attr + ' ' + data[attr] + '</p>');
                }
            }
        });
        
        return false;
    }).find('input[type=submit]').formValidator(
        {
            'errors': {  
                'email': I18n.t('layouts.application.header.sign_up_form.error_email_invalid'),
                'text': I18n.t('layouts.application.header.sign_up_form.error_username_empty')
            }
        }
    );
    
    $('.sign-up-form #user_email').change(function () {
        $('.sign-up-form #user_username').val($(this).val().replace(/@.*$/, ''));
    });

    $('.login-form').submit(function(){
        $(this).find('.error').remove(); 
        
        //If Ajax request and username is already registered
        if(false){
            $('<p>').addClass('error').html(I18n.t('layouts.application.header.login_form.invalid')).insertAfter('#password'); 
            return false;
        }
        
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











