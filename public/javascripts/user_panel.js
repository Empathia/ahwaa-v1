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
              type: 'POST',
          });
      });
    }
};

$(function(){    

    $('#user_profile_attributes_gender_id, #user_profile_attributes_age_id').change(function(){
        avatars.getMatchingAvatars();
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
    
    var editForm = $('.edit-form');
    editForm.find('input[type=submit]').formValidator({
        'errors': {  
            'email': I18n.t('users.show.sidebar.my_account.errors.invalid_email'),
            'password': 'The new password its too short.'
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
        });
        
    $('#reply-form').live('submit',function(){
        $('textarea').val('Click here to add a reply').css('height','16px');
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
});


