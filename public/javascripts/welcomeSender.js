(function ($, window) {
    $(function () {
        var welcomeMessage, WM;
        welcomeMessage = WM = {
            tooltip: null,
            frm: null,
            btn: null,
            tooltipClassName: 'private-msg',
            formClassName: 'form-welcome-msg',
            btnClassName: 'welcome-btn > a',
            speed: 250,
            
            init: function () {
                this.tooltip = $('.' + this.tooltipClassName);
                this.frm = this.tooltip.find('.' + this.formClassName);
                this.btn = this.tooltip.find('.' + this.btnClassName);
                if (this.frm.length && this.btn.length && this.tooltip.length) {
                    this.bindEvents();
                } else {
                    console.error("something is wrong!")
                }
            },
            
            bindEvents: function () {
                var frm;
                this.btn.live('click', function (e) {
                    e.preventDefault();
                    WM.showForm(this);
                });
                this.frm.submit(function () {
                    frm = $(this);
                    WM.sending(frm);
                }).find('input[type=submit]').click(function (e) {
                    WM.sendForm(frm, e);
                });
                this.frm.find('.cancel').live('click', function (e) {
                    e.preventDefault();
                    WM.frm.slideUp(WM.speed);
                    WM.btn.removeClass('disabled');
                });
                this.frm.find('.include-message').live('change', function (e) {
                    var $this = $(e.target),
                        tooltip = $this.closest('.' + WM.tooltipClassName),
                        frm = tooltip.find('.' + WM.formClassName);
                    if ($this.is(':checked')) {
                        frm.find('textarea').slideDown(WM.speed);
                    } else {
                        frm.find('textarea').slideUp(WM.speed);
                    }
                });
            },
            
            showForm: function (btn) {
                var btn = $(btn),
                    tooltip = btn.closest('.' + WM.tooltipClassName),
                    frm = tooltip.find('.' + WM.formClassName);
                
                tooltip.find('form').slideUp(WM.speed);
                tooltip.find('.' + WM.btnClassName).not(this).removeClass('disabled');
                if (!btn.hasClass('disabled')) {
                    btn.addClass('disabled');
                    frm.slideDown(WM.speed);
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
            
            sending: function (frm) {
                frm.find('.cancel').addClass('loading');
            },

            sendForm: function (frm, e) {
                var textarea = frm.find('textarea');
                frm.find('.error').remove();
                if (!frm.find('.include-message').is(':checked')) {
                    frm.prepend('<div class="pm-flash error border-all"><p>' + I18n.t('private_message.message_empty') + '</p></div>');
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };
        WM.init();
    });
}(jQuery, window));