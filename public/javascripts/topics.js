$(function(){

    $("input:radio, input:visible:checkbox").uniform();

    function is_touch_device() {
        return !!('ontouchstart' in window);
    }

    var UI = {
        windowObj           : $(window),
        loginButton         : $('#login'),
        article             : $(".article-wrapper"),
        followTopicBtn      : $('.follow-topic'),
        socialBookmarkers   : $('.social-bookmarkers'),
        mainContent         : $('.left-side').eq(0)
    };
    UI.sidebar = UI.article.find('aside');

    var _w              = window.innerWidth,
        leftSideWidth   = UI.mainContent.width(),
        rtl             = $('html').attr('dir') == 'rtl';

    var fontSizeControls = {
        MAX_SIZE: 20,
        MIN_SIZE: 12,
        MOD_INTERVAL: 1,
        LINE_HEIGHT: 1.6,
        increase_button: $('#font-size-controls .increase'),
        decrease_button: $('#font-size-controls .decrease'),
        targets: null,
        init: function () {
            this.targets = $('.topic-content p:not(.private-msg p)');
            this.bindEvents();
        },
        bindEvents: function () {
            this.increase_button.click(function (e) {
                e.preventDefault();
                fontSizeControls.increaseFont();
            });
            this.decrease_button.click(function (e) {
                e.preventDefault();
                fontSizeControls.decreaseFont();
            });
        },
        increaseFont: function () {
            var currentSize = parseInt(fontSizeControls.targets.css('fontSize'), 10);
            if (currentSize + fontSizeControls.MOD_INTERVAL <= fontSizeControls.MAX_SIZE) {
                fontSizeControls.targets.css({
                    fontSize: currentSize + fontSizeControls.MOD_INTERVAL,
                    lineHeight: Math.round(currentSize * fontSizeControls.LINE_HEIGHT) + 'px'
                });
            }
        },
        decreaseFont: function () {
            var currentSize =  parseInt(fontSizeControls.targets.css('fontSize'), 10);
            if (currentSize - fontSizeControls.MOD_INTERVAL >= fontSizeControls.MIN_SIZE) {
                fontSizeControls.targets.css({
                    fontSize: currentSize - fontSizeControls.MOD_INTERVAL,
                    lineHeight: Math.round(currentSize * fontSizeControls.LINE_HEIGHT) + 'px'
                });
            }
        }
    };
    UI.windowObj.load(function () {
        fontSizeControls.init();
    });

    var thankMsgTooltip = $('.tt-thank-msg');
    if ( thankMsgTooltip.length ) {
        var thankMsg = {
            speed: 250,
            button: $('.thank-btn a'),
            tooltip: thankMsgTooltip,
            contentWrapper: null,
            checkbox: null,
            init: function () {
                this.contentWrapper = this.tooltip.find('.content-wrapper');
                this.checkbox = this.tooltip.find('.include-message');
                this.checkbox.is(':checked') ? this.contentWrapper.slideDown(this.speed) : this.contentWrapper.slideUp(this.speed);
                this.bindEvents();
            },
            bindEvents: function () {
                var timer;
                this.button.click(function (e) {
                  if ($(this).closest('li').hasClass('disabled')) {
                      UI.loginButton.trigger('click');
                      return false;
                  }

                  e.preventDefault();
                });
                this.checkbox.change(function (e) {
                    var $this = $(e.target);
                    if ($this.is(':checked')) {
                        thankMsg.contentWrapper.slideDown(thankMsg.speed);
                    } else {
                        thankMsg.contentWrapper.slideUp(thankMsg.speed);
                    }
                });
                this.tooltip.mouseleave(function () {
                    this.style.display = 'block';
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    timer = setTimeout(function () {
                        thankMsg.tooltip[0].style.display = '';
                    }, 1500);
                });
            }
        };
        thankMsg.init();
    }

    UI.followTopicBtn.bind('click', function () {
        if ($(this).hasClass('disabled')) {
            UI.loginButton.trigger('click');
            return false;
        }
    }).bind('ajax:success', function () {
        var self = $(this);
        if (!self.hasClass('disabled')) {
            if (self.hasClass('following')) {
                self.removeClass('following').text(I18n.t('topics.show.follow'));
                self.attr('href', self.attr('href').replace('/unfollow.json', '/follow.json'));
            } else {
                var x,
                animationDelay = 200,
                animationIterations = 5;
                for(var x=0; x<animationIterations; x++) {
                    self.queue(function() {
                        setTimeout(function() {
                            self.dequeue();
                        }, animationDelay);
                    });
                    self.toggleClass('btn-animation-feedback', 10);
                    self.queue(function() {
                        setTimeout(function() {
                            self.dequeue();
                        }, animationDelay);
                    });
                    self.toggleClass('btn-animation-feedback', 10);
                }
                self.addClass('following').text(I18n.t('topics.show.unfollow'));
                self.attr('href', self.attr('href').replace('/follow.json', '/unfollow.json'));
            }
        }
    });

    $('.topic-content > p').comments();

    var resizeTimer = null;
    UI.windowObj.resize(function() {
        if ( resizeTimer ) clearTimeout( resizeTimer );
        resizeTimer = setTimeout(function () {
            _w = window.innerWidth;
            if ( UI.socialBookmarkers.data("fixed") == true ) {
                UI.socialBookmarkers.css('left', calculatePosX( UI.socialBookmarkers ));
            }
            if ( UI.sidebar.data("fixed") == true ) {
                UI.sidebar.css('left', calculatePosX( UI.sidebar ));
            }
        }, 50);
    });

    function getRealtedContent (topic_id, callback) {
        $.ajax({
            url: '/topics/related_content',
            data: {topic_id: topic_id},
            type: 'GET',
            success: function(data) {
                $(".insert-all").html(data);
                if (callback) callback();
             }
        });
    }


    $('.view-more').click(function(e){
        $('.view-more > span').css("background", "url(../images/loading-s-white.gif) no-repeat 105% 1px");
        var topic_id  = $(".view-more").data("topic-id");
        getRealtedContent(topic_id, abc);
        function abc() {
            var carrouselWrapper = $('.related-carrousel'),
            carrousel = carrouselWrapper.children('ul:eq(0)');
            carrousel.children().show();

            !($.browser.msie && $.browser.version == '7.0') && carrouselWrapper.css({
                overflow: 'hidden',
                height: carrouselWrapper.height()
            });

            if ( !($.browser.msie && $.browser.version == '7.0') && carrousel.outerHeight() > carrouselWrapper.outerHeight() ) {
                console.log("SECOND")
                $(this).hide();
                carrouselWrapper.animate({height:carrousel.outerHeight()}, function(){
                    carrouselWrapper.css('overflow', 'visible');
                });
            }
        }

        e.preventDefault();
        return false;
    });

    if($.browser.msie && $.browser.version == '7.0') {
        var topicAvatars = $('.topic-avatars').children(),
            j = 0;
        topicAvatars.each(function(i){
            $(this).css('z-index', topicAvatars.length - j);
            i % 2 && j++;
        });
    }

    function calculatePosX(fixedElement){
        var leftSideWidth = UI.mainContent.width(),
            articleOffset = UI.article.offset(),
            left = fixedElement.hasClass('social-bookmarkers')
                ? (rtl ? articleOffset.left + leftSideWidth - self.scrollLeft() : articleOffset.left - 30)
                : (rtl ? articleOffset.left : articleOffset.left + leftSideWidth - UI.windowObj.scrollLeft());
        return left;
    }

    var positioningSidebar = function positioningSidebar () {
        var selfOffset      = UI.article.offset().top - 139,
            selfHeight      = UI.article.outerHeight(),
            windowOffset    = UI.windowObj.scrollTop(),
            sidebarHeight   = UI.sidebar.outerHeight(true),
            sidebarPosX     = Math.round( UI.sidebar.offset().left ),
            cssProperties = {};

            if (selfOffset - windowOffset < 0 && (selfOffset - windowOffset > -selfHeight) && (selfOffset - windowOffset < sidebarHeight-selfHeight)) {
                cssProperties = {
                    position : "absolute",
                    bottom: "0",
                    top: "auto"
                };
                UI.sidebar.data("fixed", false);
            } else if (selfOffset - windowOffset < 0 && selfOffset - windowOffset > -selfHeight) {
                UI.windowObj.scrollLeft() && (sidebarPosX = calculatePosX( UI.sidebar ));
                cssProperties = {
                    position: "fixed",
                    left: sidebarPosX,
                    right: "auto",
                    bottom: "auto",
                    top: 139
                }
                UI.sidebar.hasClass('social-bookmarkers') && (cssProperties = $.extend({top: 112},cssProperties));
                UI.sidebar.data("fixed", true);
            } else {
                cssProperties = {
                    position : "absolute",
                    bottom: "auto",
                    top: "0"
                };
                UI.sidebar.data("fixed", false);
            }

            if ( UI.sidebar.data('fixed') == false ) {
                cssProperties = $.extend(UI.sidebar.hasClass('social-bookmarkers')
                    ? (rtl ? {right: "-30px", left: "auto"} : {left: "-30px", right: "auto"})
                    : (rtl ? {left: "0", right: "auto"} : {left: "auto", right: "0"}), cssProperties);
            }
        UI.sidebar.css(cssProperties);
    };

    var scrollTimer;
    UI.windowObj.scroll(function (e) {
        if ( _w >= 768 && UI.sidebar.length ) {
            if ( !is_touch_device() ) {
                positioningSidebar();
            } else {
                if ( scrollTimer ) clearTimeout( scrollTimer );
                scrollTimer = setTimeout(function () {
                    positioningSidebar();
                }, 500);
            }
        }
    });

    UI.windowObj.scroll();
});
