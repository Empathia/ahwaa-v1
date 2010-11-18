$(function(){
    $('.topic-content > p').comments({color: '#FFFF00'});
    $('.related-content > div > ul').blockSlider();

    /* The Browser Sniff is pending*/
    $('.add_comments > div > textarea').click(function(){
        $(this).css('color', '#6c6f74');
    });                                

    $('.add_comments > div > textarea').live('keypress', function(e){
        var textarea = $(this);
        e.keyCode == '13' && textarea.height(textarea.height() + 13);
    });

    var posX = Math.ceil(($(window).width() - 960)/2) - 30;
    $('.social-bookmarkers').css({'left' : posX + 'px', 'display' : 'block'}); 
   

    var article = $(".article-wrapper"),
        sidebar = article.find('aside'),
        posLeft = article.offset().left + 786;
    sidebar.css('left', posLeft - $(window).scrollLeft());
    
    $(window).resize(function() {
        var self = $(this);
        posX = Math.ceil(($(window).width() - 960)/2) - 30;
        $('.social-bookmarkers').css({'left' : posX + 'px', 'display' : 'block'});        
        sidebar.data("fixed") == "true" && sidebar.css('left', posLeft - self.scrollLeft());
    });

    $('.continue').live('click', function(){
       $(this).closest('.sign-up-or-continue').slideUp(function(){
           var signUp = $(this);
           signUp.next().slideDown();
           signUp.remove();
       });
    });  
    
    $('.res-flag-btns').find('a').live('click', function(e){
        var lk = $(this),
            sign_up = lk.parent().find('.sign-up-tt-wrapper');
        if(sign_up.is(':visible') && lk.hasClass('clicked')){    
            lk.removeClass('clicked');
            sign_up.fadeOut();
        }
        else{     
            lk.siblings('.clicked').removeClass('clicked');
            lk.addClass('clicked');            
            sign_up.css('left', (Math.abs(Math.floor(lk.outerWidth()/2 - sign_up.outerWidth()/2))*-1+lk.position().left)).animate({top : '-110', opacity : 'show'}, 'slow')
        }
        e.preventDefault();
        return false;
    });

    $('.comment-st-level, .comment-nd-level').live('mouseleave', function(){
       $('.sign-up-tt-wrapper').hide();
    });
        
    $('.flag:not(.disabled)').live('click', function () {
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
    
    $(window).scroll(function(e){
		var selfOffset = article.offset().top-112,
    		selfHeight = article.outerHeight(),
    		windowOffset = $(window).scrollTop(),
    		sidebarHeight = sidebar.outerHeight(true),
    		sidebarPosX = sidebar.offset().left;

    	if(selfOffset - windowOffset < 0 && selfOffset - windowOffset > -selfHeight && selfOffset - windowOffset < sidebarHeight-selfHeight){
    	    sidebar.data("fixed", "false").css({
    	  			"position" : "absolute",
    	  			"left": "auto",
    	  			"right" : "0",
    	  			"bottom" : "0"
    	  		});
    	} else if(selfOffset - windowOffset < 0 && selfOffset - windowOffset > -selfHeight){
    	    sidebar.data("fixed", "true").css({
    	    		"position": "fixed",
    	    		"left": sidebarPosX,
    	    		"right": "auto",
    	  			"bottom" : "auto"
    	    	});
    	} else {                            
    	    sidebar.data("fixed", "false").css({
    	    		"position" : "absolute",
    	    		"right" : "0",
    	    		"left" : "auto",
    	    		"bottom": "auto"
    	    	});
    	}

        sidebar.data("fixed") == "true1" && sidebar.css('left', posLeft - $(window).scrollLeft());
    });    
});
