Class('MessageSender')({
    prototype: {
        
        tooltip: null,
        frms: {},
        btns: {},
        speed: 250,
        
        init: function () {
            this.tooltip = $('.private-msg');
            this.frms.pm = this.tooltip.find('.form-private-msg');
            this.btns.pm = this.tooltip.find('.send-private-msg');
            this.frms.welcome = this.tooltip.find('.form-welcome-msg');
            this.btns.welcome = this.tooltip.find('.welcome-btn');
            this.bindEvents();
        },
        
        bindEvents: function () {
            var instance = this;
            if (this.frms.welcome.length) {
                this.btns.welcome.click(function (e) {
                    e.preventDefault();
                    instance.showForm.call(this, instance, instance.frms.welcome, instance.btns.welcome);
                });
                this.frms.welcome.submit(function () {
                    instance.sending.call($(this));
                }).find('input[type=submit]').click(function (ev) {
                    instance.sendForm(instance, instance.frms.welcome, ev);
                });
                this.frms.welcome.find('.cancel').click(function () {
                   instance.frms.welcome.slideUp(instance.speed);
                   instance.btns.welcome.removeClass('disabled');
                   return false;
                });
                this.frms.welcome.find('.include-message').change(function (e) {
                    var $this = $(e.target);
                    if ($this.is(':checked')) {
                        instance.frms.welcome.find('textarea').slideDown(instance.speed);
                    } else {
                        instance.frms.welcome.find('textarea').slideUp(instance.speed);
                    }
                });
            }
            
            if (this.frms.pm.length) {
                this.btns.pm.click(function (e) {
                    e.preventDefault();
                    instance.showForm.call(this, instance, instance.frms.pm, instance.btns.pm);
                });
                this.frms.pm.submit(function () {
                    instance.sending.call($(this));
                }).find('input[type=submit]').click(function (ev) {
                    instance.sendForm(instance, instance.frms.pm, ev);
                });
                this.frms.pm.find('.cancel').click(function () {
                   instance.frms.pm.slideUp(instance.speed);
                   instance.btns.pm.removeClass('disabled');
                   return false;
                });
            }
        },
        
        sendForm: function (instance, frm, ev) {
            var textarea = frm.find('textarea');
            frm.find('.error').remove();
            if (frm.hasClass('form-welcome-msg')) {
                if (!frm.find('.include-message').is(':checked')) {
                    frm.prepend('<div class="pm-flash error border-all"><p>' + I18n.t('private_message.message_empty') + '</p></div>');
                    ev.preventDefault();
                    ev.stopPropagation();
                }
            } else {
                if (textarea.attr('placeholder') == textarea.val() || $.trim(textarea.val()) == '') {
                    frm.prepend('<div class="pm-flash error border-all"><p>' + I18n.t('private_message.message_empty') + '</p></div>');
                    ev.preventDefault();
                    ev.stopPropagation();
                }
            }
        },
        
        sending: function () {
            $(this).find('.cancel').addClass('loading');
        },
        
        showForm: function (instance, frm, btn) {
            var that = $(this);
            $.each(instance.frms, function () {
                if (frm !== this) {
                    $(this).slideUp(instance.speed);
                }
            });
            $.each(instance.btns, function () {
                if (btn !== this) {
                    $(this).removeClass('disabled');
                }
            });
            if(!that.hasClass('disabled')) {
                that.addClass('disabled');
                frm.slideDown(instance.speed);
                if (!$.browser.webkit) {
                    var textarea = frm.find('textarea');
                    textarea.attr('value', textarea.attr('placeholder'));
                    textarea.focus(function() {
                        textarea.val() == textarea.attr('placeholder') && textarea.val('');
                        textarea.blur(function() {
                            (textarea.val().length <= 1 || textarea.val() ==  textarea.attr('placeholder')) && textarea.attr('value', textarea.attr('placeholder'));
                        });
                    });
                }
            }
        },
    }
});