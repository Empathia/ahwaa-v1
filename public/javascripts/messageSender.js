Class('MessageSender')({
    prototype: {
        init: function() {
            
            $('.send-private-msg').live('click', function() {
                if(!$(this).hasClass('disabled')) {
                    var private_form = $(this).addClass('disabled').closest('.private-msg');
                    private_form.children('form').slideDown();
                    if (!$.browser.webkit) {
                        var textarea = private_form.find('textarea');
                        textarea.attr('value', textarea.attr('placeholder'));
                        textarea.focus(function() {
                            textarea.val() == textarea.attr('placeholder') && textarea.val('');
                            textarea.blur(function() {
                                (textarea.val().length <= 1 || textarea.val() ==  textarea.attr('placeholder')) && textarea.attr('value', textarea.attr('placeholder'));
                            });
                        });
                    }
                }
                return false;
            });

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
        }
    }
});
