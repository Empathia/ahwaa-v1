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

$(function () {
    $('#reply-form').live('submit',function(){
        var textarea = $(this).find('textarea');
        textarea.val(textarea.attr('placeholder')).css('height','16px');
        $('#private_message_submit').css('display','none');
        $(this).hide();
    });
});
