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
            'left': $.browser.msie ? link.offset().left : link.offset().left + 3,
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
        !$(e.target).hasClass('auth-form-active') && !$(e.target).closest('.auth-form-active').length && $('.auth-form-active').removeClass('auth-form-active').filter('form').addClass('hidden');
        if(e.target.tagName != "a"){ $('.search_results').removeClass('visible'); }
    });

    $('.cancel-forgot').click(function(){
        $('.auth-form-active').removeClass('auth-form-active');
        toggleSignUp($('#login'));
        return false;
    });

    $('.sign-up-form').submit(function(){
        $(this).find('.legend').addClass('loading');
    }).find('input[type=submit]').formValidator(
        {
            'errors': {              
                'email': {
                    'empty': I18n.t('layouts.application.header.sign_up_form.error_email_empty'),
                    'invalid': I18n.t('layouts.application.header.sign_up_form.error_email_invalid')
                },
                'text': I18n.t('layouts.application.header.sign_up_form.error_username_empty')
            }
        }
    );

    $('.sign-up-form #user_email').change(function () {
        $('.sign-up-form #user_username').removeClass('placeholder').val($(this).val().replace(/@.*$/, '').replace(/[^a-z0-9]/i, ''));
    });

    $('.login-form').submit(function(){
      $(this).find('#forgot-pass').addClass('loading');
    }).find('input[type=submit]').formValidator({
        'errors': {
            'text': I18n.t('layouts.application.header.login_form.error_login_empty'),
            'password': {
                'invalid': I18n.t('layouts.application.header.sign_up_form.error_password_short'),
                'empty': I18n.t('layouts.application.header.sign_up_form.error_password_empty')
            }
        }
    });

    $('.forgot-pass-form').submit(function(){
        $(this).find('.cancel-forgot').addClass('loading');
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
            if (!$.browser.webkit) {
                var textarea = $(this).closest('.private-msg').find('textarea');
                textarea.attr('value', textarea.attr('placeholder'));
                textarea.focus(function(){
                textarea.val() == textarea.attr('placeholder') && textarea.val('');
                textarea.blur(function(){
                        (textarea.val().length <= 1 || textarea.val() ==  textarea.attr('placeholder')) && textarea.attr('value', textarea.attr('placeholder'));
                    });
                });
            }
        }
        return false;
    })
    
    $('.form-private-msg').submit(function(){
      $(this).find('.cancel').addClass('loading');
    }).find('input[type=submit]').live('click', function(ev){
        var formPrivateMsg = $(this).closest('form');
        var textarea = formPrivateMsg.find('textarea');
        formPrivateMsg.find('.error').remove();
        if(textarea.attr('placeholder') == textarea.val() || $.trim(textarea.val()) == ''){
            formPrivateMsg.prepend('<div class="pm-flash error border-all"><p>' + I18n.t('private_message.message_empty') + '</p></div>');
            ev.preventDefault();
            ev.stopPropagation();
        }
    });
    
    $('.private-msg').find('.cancel').live('click', function(){
       $(this).closest('.private-msg').find('form').slideUp().end().find('.send-private-msg').removeClass('disabled');
       return false;
    });

    $('.avatar, .avatar + em').live('mouseover',function(){ 
        var pm = $(this).siblings('.private-msg');
        pm.show(0, function () {
            if(pm.offset().left < 0 || pm.offset().left + pm.outerWidth() > $(window).width()) {
                pm.addClass('inside');
            }
        });
        pm.hide();
        pm.fadeIn('fast').addClass('active-avatar');
    });

    $('.active-avatar').live('mouseleave', function(){
       var pm = $(this);
       pm.fadeOut('fast', function(){
         pm.find('.pm-flash').remove();
       });
    });
    
    $('input[type=text], input[type=email], input[type=password], textarea').live('focus', function(){
        $(this).hasClass('error') && $(this).removeClass('error') && $(this).siblings('p.error').remove();
    });

    $('.items > div:last-child').css("background","none");
     
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
     };
     
     $('.icn-cross').live('click', function(){
        $(this).parent().slideUp();
     });
});

var scrollerInteval;

$(window).load(function () {
    $(".request-topic.active").pageSlide({ width: "556px", direction: I18n.locale == 'ar' ? 'right' : "left", modal: true }).click(function(){
        var sidebar = $(".article-wrapper").find('aside');                                                                                                                                                                       
        sidebar.length && sidebar.data('fixed') == true && sidebar.css({position : "absolute", bottom: "auto", right: 0, left: "auto", top: sidebar.position().top - 126}) && sidebar.data("fixed", false);
        $('#pageslide-blanket').css('min-height', $(document).height());
        $('.pageslide-body-wrap').addClass('jlo');
        $('.flash-privacy').show();
    });

    $('.more').hover(function () {
        $(this).find('.more-tags').show();
    }, function () {
        $(this).find('.more-tags').hide();
    });

    var headerTags = $('#header-tags'),
        moreTags = $('#moretags'),
        tag = null,
        self = $(this),
        count = 0;
    headerTags.css('width', '9999em').children(':not(.more)').each(function(){
        tag =  $(this);              
        count += tag.outerWidth();
        if(count > 650) {  
            moreTags.append(tag.clone());
            tag.addClass('to-more');
        }                            

    }).filter('.to-more').remove();
    moreTags.find('li').length === 0 && headerTags.find('.more').remove();
    headerTags.css('width', 'auto').parent().css('overflow', 'visible');

    if($('.more').length) {
        $('.more-tags').show();
        var newHeight = $(window).height() - $('.scroll-tags').offset().top - $('.scroll-down').height() - 40;
        if(newHeight < $('#moretags').height()) {
            $('.scroller').height(newHeight);

            $('.scroll-down').hover(function () {
                scrollerInterval = setInterval(function () {
                    $('.scroller').scrollTop($('.scroller').scrollTop() + 3);
                }, 1);
            }, function () {
                clearInterval(scrollerInterval);
            });

            $('.scroll-up').hover(function () {
                scrollerInterval = setInterval(function () {
                    $('.scroller').scrollTop($('.scroller').scrollTop() - 3);
                }, 1);
            }, function () {
                clearInterval(scrollerInterval);
            });
        } else {
            $('.scroll-tags .arrow').remove();
        }
        $('.more-tags').hide();
    }
    
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
