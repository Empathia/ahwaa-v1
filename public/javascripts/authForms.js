Class('AuthForms')({
    hide: function () {
        $('.auth-wrapper > a').add('.over-form').removeClass('auth-form-active').filter('.over-form').addClass('hidden');
    },

    show: function(target, formName) {
        this.hide();
        target.addClass('auth-form-active');
        if(!formName){
          formName = '.' + target.attr('id') + '-form';
        }
        var form = $(formName);
        this.removeErrors(form);
        form.removeClass('hidden').addClass('auth-form-active').offset({
            'left': ($.browser.msie && $.browser.msie == '7.0') ? target.offset().left : target.offset().left + 3,
            'top': target.offset().top + target.outerHeight() - 1
            }
        );
    },

    removeErrors: function (form) {
        form.find('.error').removeClass('error').filter('p').remove();
    },

    prototype: {
        init: function() {
            this._binds();
            this._validations();
        },

        _validations: function () {
            $('.sign-up-form').submit(function(){
                $(this).find('.legend').addClass('loading');
            }).find('input[type=submit]').formValidator({
                'errors': {
                    'email': {
                        'empty': I18n.t('layouts.application.header.sign_up_form.error_email_empty'),
                        'invalid': I18n.t('layouts.application.header.sign_up_form.error_email_invalid')
                    },
                    'text': I18n.t('layouts.application.header.sign_up_form.error_username_empty')
                }
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
        },

        _binds: function () {
            var that = this;

            $('.auth-wrapper > a').click(function(){
                that.constructor.show($(this));
                return false;
            });

            $('#forgot-pass').click(function(){
                $('#forgot-pass').addClass('auth-form-active');
                that.constructor.show($('#login'), '.forgot-pass-form');
                return false;
            });

            $('.sign-up-btn').live('click', function(){
                var btn = $(this);
                btn.addClass('auth-form-active').closest('.request-error').removeClass('auth-form-active');
                that.constructor.show($('#sign-up'));
                return false;
            });

            $('.request-topic').click(function(e){
                e.preventDefault();
                var _btn = $(this);
                if(_btn.hasClass('disabled')){
                    _btn.addClass('auth-form-active');
                    $('.auth-form-active').removeClass('auth-form-active');
                    var offset = _btn.offset();
                    $('.request-error').addClass('auth-form-active');
                    return false;
                }
            });

            $(document).unbind('click').click(function(e){
                !$(e.target).hasClass('auth-form-active') && !$(e.target).closest('.auth-form-active').length && $('.auth-form-active').removeClass('auth-form-active').filter('form').addClass('hidden');
                e.target.tagName != "a" && $('.search-results-wrapper').removeClass('visible');
            });

            $('.cancel-forgot').click(function(){
                $('.auth-form-active').removeClass('auth-form-active');
                that.constructor.show($('#login'));
                return false;
            });

            $('.over-form').find('input').keyup(function(){
                var input = $(this);
                $.trim(input.val()) && input.next('.auth-form-error').remove();
            });
        }
    }
});
