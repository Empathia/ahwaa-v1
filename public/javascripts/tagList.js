Class('TagList')({
    prototype: {
        init: function() {
            var headerTags = $('#header-tags'),
                moreTags = $('#moretags'),
                tag = null,
                count = 0,
                scrollerInterval;
            headerTags.css('width', '9999em').children(':not(.more)').each(function(){
                tag =  $(this);
                count += tag.outerWidth();
                if(count > 850) {
                    moreTags.append(tag.clone());
                    tag.addClass('to-more');
                }
            }).filter('.to-more').remove();
            moreTags.find('li').length === 0 && headerTags.find('.more').remove();
            headerTags.css('width', 'auto').parent().css('overflow', 'visible');

            if($('.more').length) {
                $('.more-tags').show();
                var newHeight = $(window).height() - $('.scroll-tags').offset().top - $('.scroll-tags > .scroll-down').height() - 40;
                if(newHeight < $('#moretags').height()) {
                    $('.scroller').height(newHeight);

                    $('.scroll-tags > .scroll-down').hover(function () {
                        scrollerInterval = setInterval(function () {
                            $('.scroller').scrollTop($('.scroller').scrollTop() + 3);
                        }, 1);
                    }, function () {
                        clearInterval(scrollerInterval);
                    });

                    $('.scroll-tags > .scroll-up').hover(function () {
                        scrollerInterval = setInterval(function () {
                            $('.scroller').scrollTop($('.scroller').scrollTop() - 3);
                        }, 1);
                    }, function () {
                        clearInterval(scrollerInterval);
                    });
                } else {
                    $('.scroll-tags > .arrow').remove();
                }
                $('.more-tags').hide();
            }

            if($.browser.msie){
                $.browser.version == '8.0' ? $('.over-form').removeClass('ie8-hide') : headerTags.parent().css('position', 'static');
            }
        }
    }
});
