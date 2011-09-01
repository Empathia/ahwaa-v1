/*Class('Avatars')({
    prototype: {
        init: function() {
            $('.avatar > img').live('mouseover',function(){ 
                var pm = $(this).parent().siblings('.private-msg');
                pm.show(0, function () {
                    if(pm.offset().left < 0 || pm.offset().left + pm.outerWidth() > $(window).width()) {
                        pm.addClass('inside');
                    }
                });
                pm.hide();
                pm.fadeIn('fast').addClass('active-avatar');
            });

            $('body').live('mousemove', function(e){
                if($('.active-avatar:visible').length) {
                    var xleft = $('.active-avatar').offset().left,
                        xright = $('.active-avatar').offset().left + $('.active-avatar').width(),
                        ytop = $('.active-avatar').offset().top,
                        ybottom = $('.active-avatar').offset().top + $('.active-avatar').height();
                    if((e.pageX < xleft || e.pageX > xright) || (e.pageY < ytop || e.pageY > ybottom)) {
                        $('.active-avatar').hide().removeClass('active-avatar').find('.pm-flash').remove();
                    }
                }
            });
        }
    }
});*/
