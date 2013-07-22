Class('TagList')({
    prototype : {
        init : function () {
            var _this = this;
            this.window         = $(window);
            this.headerHolder   = $('.header-wrapper');
            this.headerContainer= this.headerHolder.find('.header-tags');
            this.headerTags     = this.headerHolder.find('#header-tags');
            this.moreTagsWrap   = this.headerTags.find('.more-tags');
            this.moreTags       = this.headerTags.find('#moretags');
            this.more           = this.headerTags.find('.more');
            this.moreWidth      = this.more.outerWidth();
            this.scroller       = this.headerHolder.find('.scroller');

            this.items = this.headerTags.children(':not(.more)');
            this.moreItems = this.items.clone();

            this.moreTags.append( _this.moreItems );

            this.filterTags();
            this.bindEvents();

            if ( $.browser.msie ) {
                ( $.browser.version == '8.0' )
                    ? $('.over-form').removeClass('ie8-hide')
                    : this.headerTags.parent().css('position', 'static');
            }
        },

        bindEvents : function bindEvents () {
            var _this = this,
                timer = null;

            this.more.hover(function () {
                _this.moreTagsWrap.show();
            }, function () {
                _this.moreTagsWrap.hide();
            });

            this.window.bind('resize.tags', function () {
                if ( timer ) clearTimeout( timer );
                timer = setTimeout(function () {
                    _this.filterTags();
                }, 1500);
            });
        },

        filterTags : function filterTags () {
            var _this = this,
                count = 0,
                availableWidth = (this.headerContainer.width() - (this.moreWidth + 10));

            this.headerTags.css('width', '9999em');
            this.items.removeClass('hide');
            this.moreItems.addClass('hide');

            for ( var i = 0; i < this.items.length; i += 1 ) {
                var tag = this.items.eq(i);
                count += tag.outerWidth();
                if ( count >= availableWidth ) {
                    tag.addClass('hide');
                    _this.moreItems.eq(i).removeClass('hide');
                }
            }

            if ( !this.moreTags.find('li:not(.hide)').length ) {
                this.more.hide();
            }

            this.headerTags.css('width', '100%');

            if ( this.more.is(':visible') ) {
                this.moreTagsWrap.show();
                var newHeight = $(window).height() - $('.scroll-tags').offset().top - $('.scroll-tags > .scroll-down').height() - 40,
                    scrollerInterval;

                if ( newHeight < this.moreTags.height() ) {
                    this.scroller.height(newHeight);

                    $('.scroll-tags > .scroll-down').hover(function () {
                        scrollerInterval = setInterval(function () {
                            _this.scroller.scrollTop( _this.scroller.scrollTop() + 3 );
                        }, 1);
                    }, function () {
                        clearInterval(scrollerInterval);
                    });

                    $('.scroll-tags > .scroll-up').hover(function () {
                        scrollerInterval = setInterval(function () {
                            _this.scroller.scrollTop( _this.scroller.scrollTop() - 3 );
                        }, 1);
                    }, function () {
                        clearInterval(scrollerInterval);
                    });
                } else {
                    $('.scroll-tags > .arrow').remove();
                }

                this.moreTagsWrap.hide();
            }
        }
    }
});
