$(window).bind('hashchange', function() {
    var frag = $.deparam.fragment();
    if(!isNaN(parseInt(frag.m))) {
        var url = '/inbox/' + frag.m + '.js';
        if(frag.hasOwnProperty('reply')) {
            url += '?reply=true';
        }
        $.getScript(url);
    } else if (frag.hasOwnProperty('inbox') || frag.hasOwnProperty('page')) {
        $.getScript('/inbox.js?' + $.param({page: frag.page || 1}));
    }
}).trigger('hashchange');

var avatars = {
    toggle: function(){                             
        $('.avatars-wrapper').hasClass('active') ? avatars.hide() : avatars.show();
    },
    hide: function(){
        $('.avatars-wrapper').hide().removeClass('active').siblings('section').show();
    },
    show: function(){  
        var avatarsWrapper = $('.avatars-wrapper');
        avatarsWrapper.find('.thumb').length ? avatarsWrapper.show() : avatars.getMatchingAvatars();
        avatarsWrapper.addClass('active').siblings('section').hide();
    },
    getMatchingAvatars: function(){
      var avatarsWrapper = $('.avatars-wrapper');
      avatarsWrapper.fadeIn(function(){
          $('.loading').show();
          avatarsWrapper.find('.avatars').children(':not(.custom)').remove();
          var genderId = $('#user_profile_attributes_gender_id').val(),
              ageId = $('#user_profile_attributes_age_id').val();
          $.ajax({
              url: '/avatars/matches.js',
              data: 'filters[gender_id]=' + genderId + '&filters[age_id]=' + ageId,
              dataType: 'script',
              type: 'POST'
          });
      });
    }
};

$(function(){    

    $('#user_profile_attributes_gender_id, #user_profile_attributes_age_id').change(function(){
        avatars.getMatchingAvatars();
    });

    // keyCode:
    // 40: down
    // 38: up
    // 91: cmd
    // 20: mayus
    // 17: ctrl
    // 16: shift
    // 18: alt
    // 93: right cmd
    // 9: tab
    $('#country_birth').keydown(function (ev) {
        var val = $(this).val();
        val = ev.which == 8 ? val.substring(0, val.length - 1) : (val + String.fromCharCode(ev.which));
        $('input:hidden.country_id').val('');
        if(ev.which === 40) {
            var nxt = $('.autocomplete li.active').length > 0 ? $('.autocomplete li.active').next() : $('.autocomplete li:first');
            nxt.length || (nxt = $('.autocomplete li:first'));
            $('.autocomplete li.active').removeClass('active');
            nxt.addClass('active');
        } else if(ev.which == 38) {
            var nxt = $('.autocomplete li.active').length > 0 ? $('.autocomplete li.active').prev() : $('.autocomplete li:last');
            nxt.length || (nxt = $('.autocomplete li:last'));
            $('.autocomplete li.active').removeClass('active');
            nxt.addClass('active');
        } else if(ev.which == 13 || ev.which == 9) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            $('.autocomplete li.active').trigger('click');
            return false;
        } else if($.inArray(ev.which, [16, 17, 18, 91, 93, 20]) == -1) {
            $('.autocomplete').html('');
            for(var i = 0; i < countries.length; i++) {
                if(val.length > 0 && new RegExp(val, 'ig').test(countries[i][1])) {
                    if ($('.autocomplete li').length < 5) {
                        $('.autocomplete').append($('<li/>').data('cid', countries[i][0])
                            .text(countries[i][1]));
                    }
                }
            }
        }
        if ($('.autocomplete li').length > 0) {
            $('.autocomplete').show();
        } else {
            $('.autocomplete').hide();
        }
    });

    $('.autocomplete li').live('mouseover', function () {
        $(this).addClass('active');
    }).live('mouseleave', function () {
        $(this).removeClass('active');
    }).live('click', function () {
        $('#country_birth').val($(this).text());
        $('input:hidden.country_id').val($(this).data('cid'));
        $('.autocomplete').html('').hide();
    });
    
    var editForm = $('.edit-form');
    editForm.find('input[type=submit]').formValidator({
        'errors': {  
            'email': I18n.t('users.show.sidebar.my_account.errors.invalid_email'),
            'password': I18n.t('users.show.sidebar.my_account.errors.password_too_short')
        }
    }).click(function(e){
        if($('#user_password').val() !== $('#user_password_confirmation').val()) {   
            $('<p>').addClass('error').text(I18n.t('users.show.sidebar.password.errors.confirm_password')).insertAfter('.passwords .field:last');
            e.preventDefault();
            return false;
        }
    });
    
    editForm.find('.cancel').click(function(){
       editForm[0].reset();       
       editForm.find('.error').removeClass('error').filter('p').text('');
       editForm.parent().slideUp(function(){
           $('.edit-profile').slideDown();
       }) && avatars.hide();
    });
   
    $('#reply-form').live('submit',function(){
        var textarea = $(this).find('textarea');
        textarea.val(textarea.attr('placeholder')).css('height','16px');
        $('#private_message_submit').css('display','none');
        $(this).hide();
    });
    
    $('.edit-profile').find('a').click(function(){
        avatars.show(); 
        $('.new-user-msg-wrapper').slideUp();
        $(this).parent().slideUp(function(){
            $('.white-area').slideDown(function(){
                var label = null;
                $(this).find('.label').each(function(){                  
                    label = $(this);
                    label.height() <= 15 && label.css('line-height', 2);
                })
            });
        });
    });

    $('.set-avatar-id').live('click', function () {
        $('#user_profile_attributes_avatar_id').val($(this).attr('data-id'));
        $(this).closest('ul').children('li.active').removeClass('active');
        $(this).closest('li').addClass('active');
        return false;
    });
});


