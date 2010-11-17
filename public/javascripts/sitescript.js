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
        return false;
    });               
    
    $('#forgot-pass').click(function(){        
        $('#forgot-pass').addClass('auth-form-active');
        toggleSignUp($('#login'), '.' + $(this).attr('id') + '-form');       
        return false;
    });
    
    $('.sign-up-btn').live('click', function(){
        var btn = $(this);
        btn.addClass('auth-form-active').closest('.request-error').removeClass('auth-form-active');
        toggleSignUp($('#sign-up'));         
        return false;
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
        toggleSignUp($('#login'));       
        return false;
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
                'email': I18n.t('layouts.application.header.sign_up_form.error_email_empty'),
                'text': I18n.t('layouts.application.header.sign_up_form.error_username_empty')
            }
        }
    );
    
    $('.sign-up-form #user_email').change(function () {
        $('.sign-up-form #user_username').val($(this).val().replace(/@.*$/, ''));
    });

    $('.login-form').submit(function(){
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
                // TODO when login fails it doesn't allow to re-submit the form
                if(data.status == 401) {
                    that.find('.password').append('<p class="error">' + I18n.t('layouts.application.header.login_form.wrong_password') + '</p>');
                } else {
                    that.find('.login').append('<p class="error">' + I18n.t('layouts.application.header.login_form.not_found') + '</p>');
                }
            }
        });
        return false;
    }).find('input[type=submit]').formValidator(
        {
            'errors': {  
                'text': I18n.t('layouts.application.header.login_form.error_login_empty'),
                'password': I18n.t('layouts.application.header.sign_up_form.error_password_empty')
            }
        }   
    );

    $('.forgot-pass-form').submit(function () {
        var that = $(this),
            inputSubmit = that.find('input[type=submit]').attr('disabled', 'disabled');
        that.find('.error').remove();
        $.ajax({
            url: this.action,
            dataType: 'json',
            type: 'post',
            data: $(this).serialize(),
            success: function (data) {
                var success = $('<p>').addClass('success').text(I18n.t('layouts.application.header.forgot_pass_form.sent')).appendTo(that.find('.login')),
                    inputTxt = that.find('.login input').hide();
                setTimeout(function(){
                    $('a.auth-form-active').removeClass('auth-form-active');
                    that.fadeOut(function(){
                        that.css('display', '').removeClass('auth-form-active');
                        success.remove();
                        inputTxt.val('').show();
                        inputSubmit.removeAttr('disabled');
                    });
                }, 2000);
            },
            error: function (data) {
                if(data.status == 404) {
                    that.find('.login').append('<p class="error">' + I18n.t('layouts.application.header.forgot_pass_form.not_found') + '</p>');
                }
                inputSubmit.removeAttr('disabled');
            }
        });
        return false;
    }).find('input[type=submit]').formValidator(
        {
            'errors': {  
                'text': I18n.t('layouts.application.header.forgot_pass_form.empty')
            }
        }   
    );

    $('.over-form').find('input').keyup(function(){
        var input = $(this);
        $.trim(input.val()) && input.next('.auth-form-error').remove();
    })
    
    $('.search').find('input').keyup(function(){
        var input = $(this);
        $.trim(input.val()) ? input.next().addClass('clear') : input.next().removeClass('clear') && $('.search_results').removeClass('visible');
    }).next().click(function(){
        var _magnify = $(this);
        _magnify.hasClass('clear') && _magnify.removeClass('clear') && _magnify.prev().val('').focus();
        $('.search_results').removeClass('visible');
    });  
    
    $('.send-private-msg').not('.disabled').click(function(){
       $(this).addClass('disabled').closest('.private-msg').children('form').slideDown();
    });                                                               

    $('.private-msg').find('.cancel').click(function(){
       $(this).closest('.private-msg').find('form').slideUp().end().find('.send-private-msg').removeClass('disabled');
    });

    $('.topic-avatars').find('.avatar').mouseover(function(){
       $(this).siblings('.private-msg').fadeIn('fast').addClass('active-avatar');
    });

    $('.active-avatar').live('mouseleave', function(){
       $(this).fadeOut('fast');
    });
});











