$(function(){
    $('.topic-content > p').comments({color: '#FFFF00'});

    /* The Browser Sniff is pending*/
    $('.add_comments > div > textarea').click(function(){
        $(this).css('color', '#6c6f74');
    });                                

    var article = $(".article-wrapper"),
        socialBookmarkers = $('.social-bookmarkers'),
        sidebar = article.find('aside'),
        leftSideWidth = 720,
        windowObj = $(window),
        rtl = $('html').attr('dir') == 'rtl';
        
        
    windowObj.load(function(){     
        sidebar.css({left:sidebar.offset().left, position: 'fixed', top: 126}).data('fixed', true);
    }); 
    
       
    windowObj.resize(function() {
        socialBookmarkers.data("fixed") == true && socialBookmarkers.css('left', calculatePosX(socialBookmarkers));
        sidebar.data("fixed") == true && sidebar.css('left', calculatePosX(sidebar));
    });

    $('.continue').live('click', function(){
       $(this).closest('.sign-up-or-continue').slideUp(function(){
           var signUp = $(this),
               form = signUp.next();
           form.slideDown();
           !$.browser.webkit && form.find('textarea').focus();
           signUp.remove();
       });
       return false;
    });  
    
    $('.view-more').click(function(e){                        
        if(!$(this).hasClass('disabled')){
            var carrouselWrapper = $('.related-carrousel'),
                carrousel = carrouselWrapper.children('ul:eq(0)');
            carrousel.outerHeight() > carrouselWrapper.outerHeight() && carrouselWrapper.animate({height:carrousel.outerHeight()}) && $(this).addClass('disabled');
        }
        e.preventDefault();
        return false;
    });
     
    if($.browser.msie && $.browser.version == '7.0') {
        var topicAvatars = $('.topic-avatars').children();
        topicAvatars.each(function(i){
            $(this).css('z-index', topicAvatars.length - i);
        });
    }

    function calculatePosX(fixedElement){
        var left = fixedElement.hasClass('social-bookmarkers') ? (rtl ? article.offset().left + leftSideWidth - self.scrollLeft() : article.offset().left - 30) : (rtl ? article.offset().left : article.offset().left + leftSideWidth - windowObj.scrollLeft());
        return left;
    }
    
    windowObj.scroll(function(e){
        sidebar.add(socialBookmarkers).each(function(){
            var selfOffset = article.offset().top-112,
        		selfHeight = article.outerHeight(),
        		windowOffset = windowObj.scrollTop(),
        		fixedElement = $(this);
        		fixedElementHeight = fixedElement.outerHeight(true),
        		fixedElementPosX = fixedElement.offset().left;
                cssProperties = {};          
        	if(selfOffset - windowOffset < 0 && selfOffset - windowOffset > -selfHeight && selfOffset - windowOffset < fixedElementHeight-selfHeight){
        	    cssProperties = {position : "absolute", bottom: "0", top: "auto"};
        	    fixedElement.data("fixed", false);
        	} else if(selfOffset - windowOffset < 0 && selfOffset - windowOffset > -selfHeight){
                windowObj.scrollLeft() && (fixedElementPosX = calculatePosX(fixedElement));
                cssProperties = {position: "fixed", left: fixedElementPosX, right: "auto", bottom: "auto", top: 126}
        	    fixedElement.hasClass('social-bookmarkers') && (cssProperties = $.extend({top: 112},cssProperties));
        	    fixedElement.data("fixed", true);
        	} else {   
        	    cssProperties = {position : "absolute", bottom: "auto", top: "0"};
        	    fixedElement.data("fixed", false);
        	}    
        	if(fixedElement.data('fixed') == false){
        	    cssProperties = $.extend(fixedElement.hasClass('social-bookmarkers') ? (rtl ? {right: "-30px", left: "auto"} : {left: "-30px", right: "auto"}) : (rtl ? {left: "0", right: "auto"} : {left: "auto", right: "0"}), cssProperties);        	      
        	}   
            fixedElement.css(cssProperties);
        });
    });    
});
