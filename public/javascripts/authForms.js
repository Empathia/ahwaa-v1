Class('AuthForms')({
    hide: function () {
        $('.auth-wrapper > a').add('.over-form').removeClass('auth-form-active').filter('.over-form').addClass('hidden');
    },

    show: function(target, formName) {
        var _this = this;

        if ( target.hasClass('auth-form-active') ) {
            // if already visible, just unbind events and hide it
            this.prototype.doc.unbind('click.closeAuthModals');
            this.hide();
            return false;
        }

        this.hide();

        target.addClass('auth-form-active');
        if (!formName) {
          formName = '.' + target.attr('id') + '-form';
        }
        var form = $(formName);
        this.removeErrors(form);
        form.removeClass('hidden').addClass('auth-form-active').offset({
            'left': ($.browser.msie && $.browser.msie == '7.0') ? target.offset().left : target.offset().left + 3,
            'top': target.offset().top + target.outerHeight() - 1
            }
        );

        this.prototype.doc.unbind('click.closeAuthModals').bind('click.closeAuthModals', function (e) {
            var notSelf = !$(e.target).closest('.auth-form-active').length;
            if ( notSelf ) {
                $('.auth-form-active').removeClass('auth-form-active').filter('form').addClass('hidden');
                _this.prototype.doc.unbind('click.closeAuthModals');
            }
        });
    },

    removeErrors: function (form) {
        form.find('.error').removeClass('error').filter('p').remove();
    },

    prototype: {

        doc : $(document),

        init : function() {
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
                    'password': {
                        'invalid': I18n.t('layouts.application.header.sign_up_form.error_password_short'),
                        'empty': I18n.t('layouts.application.header.sign_up_form.error_password_empty')
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
