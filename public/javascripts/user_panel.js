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
          $('.loading-avatar').show();
          avatarsWrapper.find('.avatars').children(':not(.custom)').remove();
          var genderId = $('#user_profile_attributes_gender_id').val(),
              ageId = $('#user_profile_attributes_age_id').val(),
              data = { filters: { gender_id : genderId, age_id : ageId } };
          data[$('meta[name=csrf-param]').attr('content')] = $('meta[name=csrf-token]').attr('content');
          $.ajax({
              url: '/avatars/matches.js',
              data: data,
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

    $('.set-avatar-id').live('click', function () {
        $('#user_profile_attributes_avatar_id').val($(this).attr('data-id'));
        $(this).closest('ul').children('li.active').removeClass('active');
        $(this).closest('li').addClass('active');
        return false;
    });

    avatars.show();

});

