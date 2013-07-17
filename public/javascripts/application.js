var lastSearchValue, timer1;

$(function() {

    var modal = $('#modal'),
        aboutPointsLink = $('.learn-about-points');

    if (aboutPointsLink.length && modal.length) {
        aboutPointsLink.click(function (e) {
            e.preventDefault();
            modal.fadeIn(100);
        });
        modal.click(function (ev) {
            if ($(ev.target).is('#modal, .close')) {
                modal.fadeOut(100);
            }
        });
    }

    /* Search field bind */
    $("#query").keyup(function(e) {
        var val = $.trim($(this).val());
        if(val.length > 2 && val != lastSearchValue) {
            lastSearchValue = val;
            $.getScript("/search/topics.js?query=" + encodeURIComponent(val));
        }
    });

    $("#query").focus(function() {
        $(this).parent().addClass("focus");
    }), $("#query").focusout(function() {
        $(this).parent().removeClass("focus");
    });

    new AuthForms();
    new MessageSender();
    new TagList();

    $('.sign-up-form #user_email').change(function () {
        $('.sign-up-form #user_username').removeClass('placeholder').val($(this).val().replace(/@.*$/, '').replace(/[^a-z0-9]/i, ''));
    });

    $('.search').find('input').keyup(function(){
        var input = $(this);
        $.trim(input.val()) ? input.next().addClass('empty') : input.next().removeClass('empty') && $('.search-results-wrapper').removeClass('visible');
    }).next().click(function(){
        var _magnify = $(this);
        _magnify.hasClass('empty') && _magnify.removeClass('empty') && _magnify.prev().val(' ').focus();
        $('.search-results-wrapper').removeClass('visible');
    });

    $('input[type=text], input[type=email], input[type=password], textarea').live('focus', function(){
        $(this).hasClass('error') && $(this).removeClass('error') && $(this).siblings('p.error').remove();
    });

    $('.items > div:last-child').css("background","none");

     var flashMsg = $('.flash');
     if(flashMsg.length){
        setTimeout(function(){
            flashMsg.css({'display': 'none', 'visibility':'visible'}).slideDown(function(){
                flashMsg.click(function(){
                  flashMsg.slideUp(function(){
                      flashMsg.remove();
                  })
                });
            });
        }, 1000);
     };

     $('.icn-cross').live('click', function(){
         $(this).closest('.flash-privacy').addClass('closed-once').slideUp();
     });

    $(".request-topic.active").pageSlide({ width: "556px", direction: I18n.locale == 'ar' ? 'right' : "left", modal: true }).click(function(){
        var sidebar = $(".article-wrapper").find('aside'),
            nav_user = $("aside.panel-sub-nav"),
            nav_user_top,
            rtl = $('html').attr('dir') == 'rtl';
        sidebar.length && sidebar.data('fixed') == true && sidebar.css({position : "absolute", bottom: "auto", right: 0, left: "auto", top: sidebar.position().top - 126}) && sidebar.data("fixed", false);
        nav_user_top = nav_user.position().top - 139;
        nav_user.css({position: 'absolute', top: nav_user_top}).fadeOut();
        $('#pageslide-blanket').css('min-height', $(document).height());
        $('.pageslide-body-wrap').addClass('jlo');
    });

    $('.need-help').click(function (e) {
        $('.help-msg.tooltip-box').fadeIn(100);
    });

    /* Preload images */
    $('<img />').attr('src', '/images/loading-s-gray.gif');
    $('<img />').attr('src', '/images/loading-s-white.gif');

    /* Avatars RollOver */
    $('body').click(function(e){
      $(e.target);
      !$(e.target).is('.private-msg *') && $('.private-msg').hide();
    });

    setTimeout(function() {
        $('.avatar').hoverIntent(function (e) {
            var _this = $(this);

            $('.private-msg.tooltip-box').fadeOut(100);

            var rollover = ( _this.parent('a').length )
                ? _this.parent('a').siblings('.private-msg')
                : _this.siblings('.private-msg');

            if ( rollover.length ) {
                var rollover_left = rollover.css('left') ? rollover.css('left') : 0,
                    rollover_top = ($('img', this).height() + 10),
                    rollover_bottom = (rollover.outerHeight() + 3),
                    indicator = _this.siblings('.private-msg').find('.origin'),
                    ind_width = 20,
                    ind_left = (( $('img', this).width() / 2) + ind_width),
                    // pbottom = $(window).height(),
                    xtop = rollover.offset().top,
                    xleft = rollover.offset().left,
                    xright = rollover.offset().left + rollover.outerWidth();

                    rollover.css({'top': rollover_top});

                if ((e.pageX + xright) > $(window).width()) {
                    rollover.addClass('inside');
                    rollover.css({'left': -( (rollover.outerWidth() - $('img', _this).parent('.avatar').outerWidth()) - 25 ) })
                    indicator.css({'left': ( (rollover.outerWidth() - $('img', _this).parent('.avatar').outerWidth()) - 25 ) + ($('img', _this).parent('.avatar').outerWidth() / 2)-10 });
                    if ($(rollover).parents('.footer-avatar').length) {
                        rollover.addClass('bottom-avatar');
                        rollover.css({'top': -(rollover_bottom) });
                    } else {
                        rollover.css({'top': rollover_top});
                    }
                } else if ($(rollover).parents('.footer-avatar').length) {
                    rollover.addClass('bottom-avatar');
                    rollover.css({'top': -(rollover_bottom) });
                } else {
                    if(rollover.hasClass('inside')) {
                        rollover.removeClass('inside')
                    } else {
                        indicator.css({'left': ind_left});
                    }
                }

                rollover.fadeIn(100)
            }
        }, function () {
            var that = $(this);
            timer1 = setTimeout(function(){
                that.siblings('.private-msg').fadeOut(100);
            }, 1000);
        });
        $('.private-msg').mouseover(function () {
            clearTimeout(timer1);
        });
        $('.private-msg').mouseleave(function () {
            $(this).fadeOut(100);
        });
    }, 2000);

    /* MOBILE MENU */
    var mobileNav = {};
    mobileNav.base      = $('.mobile-menu-wrapper');
    mobileNav.button    = mobileNav.base.find('.mobile-menu-toggler');
    mobileNav.menu      = mobileNav.base.find('.mobile-menu');
    mobileNav.search    = $('.search-icon-mobile');
    mobileNav.close     = $('.js-close-mobile-menu');
    mobileNav.tagList   = $('.header-wrapper');

    var search = {};
    search.wrapper = $('.search');
    search.input = search.wrapper.find('input');

    var loginButton     = $('.auth-wrapper > #login'),
        signupButton    = $('.auth-wrapper > #sign-up');

    var closeMenuElements = function (el) {
        search.wrapper.removeClass('show-on-mobile');
        mobileNav.tagList.removeClass('show-on-mobile');

        if ( mobileNav.menu.is(':visible') )
            mobileNav.button.trigger('click');

        AuthForms.hide();
    };

    mobileNav.button.bind('click', function (ev) {
        mobileNav.menu.toggle();

        if ( !mobileNav.menu.is(':visible') )
            document.documentElement.classList.remove('no-overflow');

        return false;
    });

    mobileNav.close.bind('click', function (ev) {
        document.documentElement.classList.remove('no-overflow');
        closeMenuElements();
        return false;
    });

    mobileNav.menu.find('.js-sign-up-trigger').bind('click', function (ev) {
        closeMenuElements();
        document.documentElement.classList.add('no-overflow');
        signupButton.trigger('click');
        return false;
    });

    mobileNav.menu.find('.js-login-trigger').bind('click', function (ev) {
        closeMenuElements();
        document.documentElement.classList.add('no-overflow');
        loginButton.trigger('click');
        return false;
    });

    mobileNav.menu.find('.js-taglist-trigger').bind('click', function (ev) {
        if ( mobileNav.menu.is(':visible') )
            mobileNav.button.trigger('click');

        document.documentElement.classList.add('no-overflow');
        mobileNav.tagList.toggleClass('show-on-mobile');
        return false;
    });

    mobileNav.search.bind('click', function (ev) {
         if ( mobileNav.menu.is(':visible') )
            mobileNav.button.trigger('click');

        search.wrapper.toggleClass('show-on-mobile');

        ( search.wrapper.is(':visible') )
            ? search.input.focus()
            : search.input.blur();
    });
    /* MOBILE MENU END */

});

$(window).load(function () {

    var container = $('.app-body-container'),
        siblings = container.siblings(),
        header = siblings.filter('header'),
        footer = siblings.filter('footer'),
        delta = header.outerHeight() + footer.outerHeight() + 50,
        self = $(this);
    container.css('min-height', $(this).height() - delta);

    self.resize(function() {
        container.css('min-height', self.height() - delta);
    });
});

$('.hall-header > h4').live({
  click: function() {
    $(this).toggleClass('closed');
    $(this).parents('.hall-of-fame').find('.hall-footer').toggleClass('collapsed');
  }
});
