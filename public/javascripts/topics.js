$(function(){
    $('.topic-content > p').comments({color: '#FFFF00'});
    $('.related-content > div > ul').blockSlider();

    /* The Browser Sniff is pending*/
    $('.add_comments > div > textarea').click(function(){
        $(this).css('color', '#6c6f74');
    });                                

    var article = $(".article-wrapper"),
        socialBookmarkers = $('.social-bookmarkers'),
        sidebar = article.find('aside'),
        leftSideWidth = 786;
    sidebar.css('left', article.offset().left + leftSideWidth - $(window).scrollLeft());

    $(window).resize(function() {
        var self = $(this);
        socialBookmarkers.data("fixed") == true && socialBookmarkers.css('left', article.offset().left - 30); 
        sidebar.data("fixed") == "true" && sidebar.css('left', article.offset().left + leftSideWidth - self.scrollLeft());
    });

    $('.continue').live('click', function(){
       $(this).closest('.sign-up-or-continue').slideUp(function(){
           var signUp = $(this);
           signUp.next().slideDown();
           signUp.remove();
       });
    });  
    
    
    /* //This code is in the comments.js file    
    $('.flag:not(.disabled)').live('click', function () {
        console.log('hola2');
        var that = $(this);
        var reply = new Reply({
            id: that.attr('data-value'),
            topic_id: topicId
        });
        reply.flag({
            success: function (r) {
                that.addClass('disabled').find('span').text(I18n.t('replies.reply.flagged'));
            },
            error: function () {
                that.addClass('disabled').find('span').text(I18n.t('replies.reply.already_flagged'));
            }
        });
        return false;
    });  
    

    $('.useful:not(.disabled)').live('click', function () {
        var that = $(this);
        var reply = new Reply({
            id: that.attr('data-value'),
            topic_id: topicId
        });
        reply.vote_up({
            success: function (r) {
                that.text(I18n.t('replies.reply.useful')).addClass('disabled');
            },
            error: function () {
                that.text(I18n.t('replies.reply.already_useful')).addClass('disabled');
            }
        });
        return false;
    });
    */
    
    $(window).scroll(function(e){
        sidebar.add(socialBookmarkers).each(function(){
            var selfOffset = article.offset().top-112,
        		selfHeight = article.outerHeight(),
        		windowOffset = $(window).scrollTop(),
        		fixedElement = $(this);
        		fixedElementHeight = fixedElement.outerHeight(true),
        		fixedElementPosX = fixedElement.offset().left;
                cssProperties = {};
        	if(selfOffset - windowOffset < 0 && selfOffset - windowOffset > -selfHeight && selfOffset - windowOffset < fixedElementHeight-selfHeight){
        	    cssProperties = {position : "absolute", bottom: "0"};
        	    cssProperties = $.extend(fixedElement.hasClass('social-bookmarkers') ? {left: "-30px", right: "auto", top: "auto"} : {left: "auto", right: "0"}, cssProperties);
        	    fixedElement.data("fixed", "false").css(cssProperties);
        	} else if(selfOffset - windowOffset < 0 && selfOffset - windowOffset > -selfHeight){
        	    $(window).scrollLeft() && (fixedElementPosX = article.offset().left + leftSideWidth - $(window).scrollLeft());
                cssProperties = {position: "fixed", left: fixedElementPosX, right: "auto", bottom: "auto"}
        	    fixedElement.hasClass('social-bookmarkers') && (cssProperties = $.extend({top: 112},cssProperties));
        	    fixedElement.data("fixed", "true").css(cssProperties);
        	} else {         
        	    cssProperties = {position : "absolute", bottom: "auto"};
        	    cssProperties = $.extend(fixedElement.hasClass('social-bookmarkers') ? {left: "-30px", right: "auto", top: "0"} : {left: "auto", right: "0"}, cssProperties);
        	    fixedElement.data("fixed", "false").css(cssProperties);
        	}     
        });
    });    
    
    $('.reply-to').live('click', function(e){
        var lk = $(this);
        lk.hasClass('clicked') ? lk.removeClass('clicked').next().slideUp() : lk.addClass('clicked').next().slideDown();
        e.preventDefault();        
        return false;
    }).next().css('display', 'none');
});
