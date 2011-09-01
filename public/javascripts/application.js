var lastSearchValue;

$(function() {
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
    //new Avatars();
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
        var sidebar = $(".article-wrapper").find('aside');
        sidebar.length && sidebar.data('fixed') == true && sidebar.css({position : "absolute", bottom: "auto", right: 0, left: "auto", top: sidebar.position().top - 126}) && sidebar.data("fixed", false);
        $('#pageslide-blanket').css('min-height', $(document).height());
        $('.pageslide-body-wrap').addClass('jlo');
        $('.flash-privacy').show();
    });

    $('.more').hover(function () {
        $(this).find('.more-tags').show();
    }, function () {
        $(this).find('.more-tags').hide();
    });

    /* Preload images */
    $('<img />').attr('src', '/images/loading-s-gray.gif');
    $('<img />').attr('src', '/images/loading-s-white.gif');
    
    /* Avatars RollOver */
    $('body').click(function(e){
      $(e.target);
      !$(e.target).is('.private-msg *') && $('.private-msg').hide();
    });
    $('.avatar > img').mouseenter(function(e){
        clearTimeout(timer1);
        $(this).parent('.avatar').siblings('.private-msg').is(':hidden') && $('.private-msg').hide();
    });
    $('.avatar').hoverIntent(function () {
        var that = $(this),
        rollover = that.siblings('.private-msg'),
        rollover_right = ((rollover.width() - $('img', this).width()) / 2),
        rollover_top = ($('img', this).height() + 15),
        indicator = that.siblings('.private-msg').find('.origin'),
        indicator_border_width = 10,
        ind_right = ((rollover.width() - indicator_border_width) / 2);

        indicator.css({'right': ind_right});
        rollover.css({'right': -rollover_right, 'top': rollover_top});
        /*pm.show(0, function () {
            if(pm.offset().left < 0 || pm.offset().left + pm.outerWidth() > $(window).width()) {
                pm.addClass('inside');
            }
        });*/
        /*
        var xleft = rollover.offset().left,
            xright = rollover.offset().left + rollover.width(),
            ytop = rollover.offset().top,
            ybottom = rollover.offset().top + rollover.height();
        if (e.pageX > xright) {
            rollover.addClass('inside');
        } else if (e.pageX < xleft) {
            rollover.removeClass('inside');
        }*/
        
        rollover.fadeIn(100)
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
        $(this).hide();
    });
});

$(window).load(function () {
    
    var container = $('.container'),
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