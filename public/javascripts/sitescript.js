$(function(){   
    
    function toggleSignUp(link, formName){
        $('.auth-wrapper > a').add('.over-form').removeClass('auth-form-active').filter('.over-form').addClass('hidden');
        link.addClass('auth-form-active');
        if(!formName){
          formName = '.' + link.attr('id') + '-form';
        }          
        var form = $(formName);
        form.find('.error').removeClass('error').filter('p').remove();
        form.removeClass('hidden').addClass('auth-form-active').offset({
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
           $('.request-error').addClass('auth-form-active');
           //e.preventDefault();
           return false;
       }
    });

    $(document).unbind('click').click(function(e){
        !$(e.target).hasClass('auth-form-active') && !$(e.target).closest('.auth-form-active').length && $('.auth-form-active').removeClass('auth-form-active');
        if(e.target.tagName != "a"){ $('.search_results').removeClass('visible'); }
    });

    $('.cancel-forgot').click(function(){
        $('.auth-form-active').removeClass('auth-form-active');
        toggleSignUp($('#login'));
        return false;
    });

    $('.sign-up-form').find('input[type=submit]').formValidator(
        {
            'errors': {
                'email': I18n.t('layouts.application.header.sign_up_form.error_email_empty'),
                'text': I18n.t('layouts.application.header.sign_up_form.error_username_empty')
            }
        }
    );

    $('.sign-up-form #user_email').change(function () {
        $('.sign-up-form #user_username').removeClass('placeholder').val($(this).val().replace(/@.*$/, ''));
    });
        
    $('.login-form').find('input[type=submit]').formValidator({
        'errors': {
            'text': I18n.t('layouts.application.header.login_form.error_login_empty'),
            'password': I18n.t('layouts.application.header.sign_up_form.error_password_empty')
        }
    });

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
    });

    $('.search').find('input').keyup(function(){
        var input = $(this);
        $.trim(input.val()) ? input.next().addClass('empty') : input.next().removeClass('empty') && $('.search_results').removeClass('visible');
    }).next().click(function(){
        var _magnify = $(this);
        _magnify.hasClass('empty') && _magnify.removeClass('empty') && _magnify.prev().val(' ').focus();
        $('.search_results').removeClass('visible');
    });

    $('.send-private-msg').live('click', function(){
        if(!$(this).hasClass('disabled')) {
            $(this).addClass('disabled').closest('.private-msg').children('form').slideDown();
            var textarea = $(this).closest('.private-msg').find('textarea');
            textarea.attr('value', textarea.attr('placeholder'));
            textarea.focus(function(){
                if(textarea.val() == textarea.attr('placeholder')){
                    textarea.val('');
                }
                textarea.blur(function(){
                        if(textarea.val().length <= 1 || textarea.val() ==  textarea.attr('placeholder')){
                            textarea.attr('value', textarea.attr('placeholder'));
                        }
                    });
                });
            }
       return false;
    })

    $('.private-msg').find('.cancel').live('click', function(){
       $(this).closest('.private-msg').find('form').slideUp().end().find('.send-private-msg').removeClass('disabled');
       return false;
    });

    $('.avatar, .avatar + em').live('mouseover',function(){
        $(this).siblings('.private-msg').removeClass('inside');
        var classes = "active-avatar";
        if($("body").width() < 1372 && $(this).parent().parent().is('div:first-child') && $(this).parent().parent().is(!'div.pm-user')  || $("body").width() < 1372 && $(this).parents().hasClass('topics') || $("body").width() < 1298 && $(this).parent().parent().is('div.response-user') ) {
           classes += "inside";
        }
        $(this).siblings('.private-msg').fadeIn('fast').addClass(classes);
    });

    $('.active-avatar').live('mouseleave', function(){
       var pm = $(this);
       pm.fadeOut('fast', function(){
         pm.find('.pm-flash').remove();
       });
    });
    
    $('input[type=text], input[type=email], input[type=password], textarea').live('focus', function(){
        $(this).hasClass('error') && $(this).removeClass('error') && $(this).siblings('p.error').remove();
    })


    $('.items > div:last-child').css("background","none");
    
    if (!$.browser.webkit) {
        var inputt = $('input:text[placeholder]'),
            inputp = $('input:password[placeholder]'),
            input = null;
        inputt.each(function(i){
            input = $(this);
            if(input.attr('placeholder').length > 0){
                input.addClass('placeholder').attr('value', input.attr('placeholder'));
                input.focus(function(e){   
                    var input = $(this);
                    input.attr('value') == input.attr('placeholder') && input.removeClass('placeholder').attr('value', '');
                    input.keypress(function (event) {
                        event.keyCode == 27 && input.addClass('placeholder').blur().attr('value', input.attr('placeholder'));
                    });
                });
                input.blur(function(){
                    var input = $(this)
                    input.attr('value').length == 0 && input.addClass('placeholder').attr('value', input.attr('placeholder'));
                })
            }
        });     
        
        inputp.each (function placeimg(){         
            var input = $(this);
            input.attr('placeholder') && input.attr('placeholder').length > 0 && input.val() == 0 && input.addClass('placeimg');
            inputp.focus(function(){
                $(this).removeClass('placeimg');
            })
            inputp.blur(function(){
                $(this).attr('value').length == 0 && $(this).addClass('placeimg');
            })
        })
        $(document).keyup(function (event) {
            if (event.keyCode == 27) $.fn.pageSlideClose();
        });
     }
                 
     var flashMsg = $('.flash');
     if(flashMsg.length){
        setTimeout(function(){                                                            
            flashMsg.css({'display': 'none', 'visibility':'visible'}).slideDown(function(){
                flashMsg.click(function(){
                  flashMsg.slideUp(function(){
                      flashMsg.remove();
                  })
                }); 
            });
        }, 1000);             
     }
});

$(window).load(function () {
    $(".request-topic.active").pageSlide({ width: "556px", direction: "left", modal: true }).click(function(){
        $('.pageslide-body-wrap').addClass('jlo');
    });
    
    var headerTags = $('#header-tags'),
        moreTags = $('#moretags'),
        tag = null,
        self = $(this);
    headerTags.css('width', '9999em').children(':not(.more)').each(function(){
        tag =  $(this);
        if(tag.position().left + tag.width() > 650) {
            moreTags.append(tag.clone());
            tag.addClass('to-more');
        }
    }).filter('.to-more').remove();
    moreTags.find('li').length === 0 && headerTags.find('.more').remove();
    headerTags.css('width', 'auto');
    if($.browser.msie){
        $.browser.version == '8.0' ? $('.over-form').addClass('hidden') : headerTags.parent().css('position', 'static');
    }
      
    var container = $('.container'),
        siblings = container.siblings(),
        header = siblings.filter('header'),
        footer = siblings.filter('footer'),
        delta = header.outerHeight() + footer.outerHeight() + 50;
    container.css('min-height', self.height() - delta);
    
    self.resize(function(){
        container.css('min-height', self.height() - delta);
    });
}); 
