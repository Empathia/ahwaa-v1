function closeFormEdit(form){
    form.find('.edit-lk').removeClass('active');
    var welcome = form.find('.welcome-wrapper');
    welcome.length && welcome.next().fadeOut(function(){
        welcome.find('.enter-profile').children().removeClass('active');
        welcome.fadeIn();
    });
    form.find('input, label, select, .passwords').css('display', 'none').end().find('span').css('display', 'block');
}

$(window).bind('hashchange', function() {
    var frag = $.deparam.fragment();
    if(!isNaN(parseInt(frag.m))) {
        var url = '/inbox/' + frag.m + '.js';
        if(frag.hasOwnProperty('reply')) {
            url += '?reply=true';
        }
        $.getScript(url);
    } else if (frag.hasOwnProperty('inbox')) {
        $.getScript('/inbox.js');
    }
}).trigger('hashchange');

var avatars = {
    toggle: function(){
        $('.avatars-wrapper').hasClass('active') ? avatars.hide() : avatars.show();
    },        
    hide: function(){
        $('.avatars-wrapper').hide().removeClass('active')
            .siblings('section').show();
    },
    show: function(){ 
        var avatarsMarkup = $('.avatars');
        avatarsMarkup.length ? $('.avatars-wrapper').show() : avatars.create();
        $('.avatars-wrapper').addClass('active')
            .siblings('section').hide();
    },
    create: function(){                   
        var avatarsWrapper = $('.avatars-wrapper');
        avatarsWrapper.fadeIn();
        setTimeout(function(){
            $('.loading').hide();
            var avatarsWrapper = $('<ul>').addClass('avatars suggested');
            var avatars = "";
            for(var i=0; i<16; i++){
                avatars += '<li ' + (i==3 ? 'class="active"' : '') + '><div class="thumb"><a href="#"><img src="/images/no-image.jpg" width="55"></a>' + (i==3 ? '<img src="/images/checkmark.png" class="checkmark"></div></li>' : '');
            }
            avatarsWrapper.append(avatars).appendTo('.avatars-wrapper');
            var avatarsOpacity = $('<ul>').addClass('avatars opacity');
            avatars = "";
            for(var i=0; i<16; i++){
                avatars += '<li><div class="thumb"><a href="#"><img src="/images/no-image.jpg" width="55"></a></div></li>';  
            }
            avatarsOpacity.append(avatars).appendTo('.avatars-wrapper');
        }, 2000);
        return false; 
    }
};

$(function(){ 
    $('.edit-lk').add('.enter-profile > a').click(function(e){        
        var link = $(this);
        if(link.hasClass('active')){
            return false;
        }
        var form = link.closest('form');
        form.find('.user-edit span').css('display', 'none').end().find('input, label, select, .passwords').css('display', 'block');
        var welcome = form.find('.welcome-wrapper');           
        if(welcome.length && welcome.is(':visible')){

            welcome.fadeOut(function(){               
                welcome.next().fadeIn();
                (!welcome.find('a').hasClass('active')) && avatars.toggle();
                link.addClass('active');
            });  
        }
        else{          
            link.addClass('active');
        }
    e.preventDefault(); 
    return false;
    });

    $('.cancel').click(function(){
        var form = $(this).closest('form');
        form[0].reset();
        form.find('.error').text('');
        closeFormEdit(form); 
        if(form.hasClass('profile')) { avatars.toggle(); }
    });    

    $('.edit-profile').click(function(){
        avatars.toggle(); 
    }); 

    $('#country_birth').keyup(function (ev) {
        var val = $(this).val();
        if(val && [8, 16, 17, 18, 91, 93, 20].indexOf(ev.which) === -1) {
            for(var i = 0; i < countries.length; i++) {
                if(new RegExp('^' + val, 'ig').test(countries[i][1])) {
                    $(this).val(countries[i][1])[0].selectionStart = val.length;
                    $('input:hidden.country_id').val(countries[i][0]);
                    break;
                } else {
                    $('input:hidden.country_id').val('');
                }
            }
        }
    }).change(function () {
        var that = $(this);
        var grep = $.grep(countries, function(a) { return a[1] == that.val(); });
        if(grep.length > 0) {
            $('input:hidden.country_id').val(grep[0][0]);
        } else {
            $(this).val('');
            $('input:hidden.country_id').val('');
        }
    });

    $('.edit-form.password input[type=submit]').click(function (ev) {
        if(!$('#user_password').val() && !$('#user_password_confirmation').val()) {
            ev.preventDefault();
            return false;
        }
        if($('#user_password').val() !== $('#user_password_confirmation').val()) {
            $('.edit-form.password').find('.error').text(I18n.t('users.show.sidebar.password.errors.confirm_password'));
            ev.preventDefault();
            return false;
        } else {
            $('.edit-form.password').find('.error').text('');
        }
    });

    /*
       $('.edit-form.password').find('input[type=submit]').formValidator(
       {
       'errors': {  
       'password': I18n.t('layouts.application.header.sign_up_form.error_login_empty'),
       'confirm_password': I18n.t('layouts.application.header.sign_up_form.error_password_empty')
       }
       }
       );
       */
    $('.edit-form.account').find('input[type=submit]').formValidator({
        'errors': {  
            'email': I18n.t('users.show.sidebar.my_account.errors.invalid_email')
        }
    });
    
    $('#reply-form textarea').live('focus',function(){
        var textarea = $(this);
        if(textarea.val() == 'Click here to add a reply'){
            textarea.val('').css('height','auto');
            $('#private_message_submit').css('display','block');
        }
        textarea.blur(function(){
                if(textarea.val().length <= 1 || textarea.val() ==  'Click here to add a reply'){
                    textarea.val('Click here to add a reply').css('height','16px');
                    $('#private_message_submit').css('display','none');
                }
            })
        })
        $('#reply-form').live('submit',function(){
            $('textarea').val('Click here to add a reply').css('height','16px');
            $('#private_message_submit').css('display','none');
            $(this).hide();
        });
});


