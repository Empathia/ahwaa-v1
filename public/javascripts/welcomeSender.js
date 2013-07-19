(function ($, window) {
    $(function () {

        var welcomeMessage, wm;

        welcomeMessage = wm = {
            tooltip: null,
            frm: null,
            btn: null,
            checkbox: null,
            cancel: null,
            tooltipClassName: 'private-msg',
            formClassName: 'form-welcome-msg',
            btnClassName: 'welcome-btn > a',
            speed: 250,
            placeholderFlag: false,

            init: function () {
                this.placeholderFlag = this.isPlaceholderSupported();
                this.tooltip = $('.' + this.tooltipClassName);
                this.frm = this.tooltip.find('.' + this.formClassName);
                this.btn = this.tooltip.find('.' + this.btnClassName);
                this.cancel = this.tooltip.find('.cancel');
                this.checkbox = this.tooltip.find('.include-message');
                this.bindEvents();
            },

            isPlaceholderSupported: function () {
                var test = document.createElement('input');
                return ('placeholder' in test);
            },

            bindEvents: function () {
                var frm;

                wm.btn.live('click', function (e) {
                    e.preventDefault();
                    if (!$(this).hasClass('disabled')) {
                        wm.showForm(this);
                    }
                });
                wm.frm.find('input[type=submit]').live('click', function (e) {
                    wm.sendForm(this, e);
                });
                wm.cancel.live('click', function (e) {
                    e.preventDefault();
                    wm.closeForm(this);
                });
                wm.checkbox.live('change', function (e) {
                    var $this = $(e.target),
                        tooltip = $this.closest('.' + wm.tooltipClassName),
                        frm = tooltip.find('.' + wm.formClassName);

                    // $.uniform.update('.include-message');

                    if ($this.is(':checked')) {
                        frm.find('textarea').slideDown(wm.speed);
                    } else {
                        frm.find('textarea').slideUp(wm.speed);
                    }
                });
                wm.frm.submit(function () {
                    wm.sending(this);
                });
            },

            showForm: function (btn) {
                var btn = $(btn),
                    tooltip = btn.closest('.' + wm.tooltipClassName),
                    frm = tooltip.find('.' + wm.formClassName);

                tooltip.find('form').slideUp(wm.speed);
                tooltip.find('.send-private-msg').removeClass('disabled');
                btn.addClass('disabled');
                frm.slideDown(wm.speed);

                if (!wm.placeholderFlag) {
                    var textarea = frm.find('textarea');
                    textarea[0].value = textarea[0].getAttribute('placeholder');
                    textarea.live('focus', function () {
                        textarea.val() == textarea.attr('placeholder') && textarea.val('');
                    });
                    textarea.live('blur',function () {
                        if (textarea[0].value.length <= 1 || textarea[0].value === textarea[0].getAttribute('placeholder')) {
                            textarea[0].value = textarea[0].getAttribute('placeholder');
                        }
                    });
                }
            },

            closeForm: function (cancel_btn) {
                var cancel_btn = $(cancel_btn),
                    tooltip = cancel_btn.closest('.' + wm.tooltipClassName),
                    frm = tooltip.find('.' + wm.formClassName),
                    btn = tooltip.find('.' + wm.btnClassName);
                frm.slideUp(wm.speed);
                btn.removeClass('disabled');
            },

            sending: function (frm) {
                $(frm).find('.cancel').addClass('loading');
            },

            sendForm: function (btn, e) {
                var btn = $(btn),
                    tooltip = btn.closest('.' + wm.tooltipClassName),
                    frm = tooltip.find('.' + wm.formClassName),
                    textarea = frm.find('textarea'),
                    is_checked = frm.find('.include-message').is(':checked'),
                    is_textarea_empty = textarea[0].getAttribute('placeholder') === textarea[0].value || $.trim(textarea[0].value) === '';

                frm.find('.error').remove();

                if (is_checked && is_textarea_empty) {
                    frm.prepend('<div class="pm-flash error border-all"><p>' + I18n.t('private_message.message_empty') + '</p></div>');
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };

        if ($('.' + wm.formClassName).length && $('.' + wm.btnClassName).length) {
            wm.init();
        }

    });
}(jQuery, window));
