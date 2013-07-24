$(function(){

    $("input:radio, input:visible:checkbox").uniform();

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

    var carrouselWrapper = $('.related-carrousel'),
        carrousel = carrouselWrapper.children('ul:eq(0)');

    $('.view-more').click(function(e){
        !($.browser.msie && $.browser.version == '7.0') && carrouselWrapper.css({
            overflow: 'hidden',
            height: carrouselWrapper.height()
        });
        carrousel.children().show();
        if ( !($.browser.msie && $.browser.version == '7.0') && carrousel.outerHeight() > carrouselWrapper.outerHeight() ) {
            $(this).hide();
            carrouselWrapper.animate({height:carrousel.outerHeight()}, function(){
                carrouselWrapper.css('overflow', 'visible');
            });
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

    var mainContent = $('.left-side').eq(0);
    function calculatePosX(fixedElement){
        var leftSideWidth = mainContent.width(),
            articleOffset = UI.article.offset(),
            left = fixedElement.hasClass('social-bookmarkers')
                ? (rtl ? articleOffset.left + leftSideWidth - self.scrollLeft() : articleOffset.left - 30)
                : (rtl ? articleOffset.left : articleOffset.left + leftSideWidth - UI.windowObj.scrollLeft());
        return left;
    }

    UI.windowObj.scroll(function (e) {
        if ( window.innerWidth >= 768 ) {
            if ( UI.sidebar ) {
                var selfOffset = UI.article.offset().top - 139,
                    selfHeight = UI.article.outerHeight(),
                    windowOffset = UI.windowObj.scrollTop(),
                    sidebarHeight = UI.sidebar.outerHeight(true),
                    sidebarPosX = UI.sidebar.offset().left;
                    cssProperties = {};

                    if (selfOffset - windowOffset < 0 && (selfOffset - windowOffset > -selfHeight) && (selfOffset - windowOffset < sidebarHeight-selfHeight)) {
                        cssProperties = {
                            position : "absolute",
                            bottom: "0",
                            top: "auto"
                        };
                        UI.sidebar.data("fixed", false);
                    } else if (selfOffset - windowOffset < 0 && selfOffset - windowOffset > -selfHeight) {
                        UI.windowObj.scrollLeft() && (sidebarPosX = calculatePosX( sidebar ));
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
            }
        }
    });

    UI.windowObj.scroll();
});
