$(function(){
    if (!$.browser.webkit) {
        var inputt = $('input:text[placeholder]'),
            inputp = $('input:password[placeholder]'),
            input = null;
        inputt.each(function(i){
            input = $(this);
            if(input.attr('placeholder').length > 0){
                input.addClass('placeholder').attr('value', input.attr('placeholder'));
                input.focus(function(e){   
                    var input = $(this);
                    input.attr('value') == input.attr('placeholder') && input.removeClass('placeholder').attr('value', '');
                    input.keypress(function (event) {
                        event.keyCode == 27 && input.addClass('placeholder').blur().attr('value', input.attr('placeholder'));
                    });
                });
                input.blur(function(){
                    var input = $(this)
                    input.attr('value').length == 0 && input.addClass('placeholder').attr('value', input.attr('placeholder'));
                })
            }
        });

        inputp.each (function placeimg(){         
            var input = $(this);
            input.attr('placeholder') && input.attr('placeholder').length > 0 && input.val() == 0 && input.addClass('placeimg');
            inputp.focus(function(){
                $(this).removeClass('placeimg');
            })
            inputp.blur(function(){
                $(this).attr('value').length == 0 && $(this).addClass('placeimg');
            })
        })
        $(document).keyup(function (event) {
            if (event.keyCode == 27) $.fn.pageSlideClose();
        });
     }
})