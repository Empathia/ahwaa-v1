$(function(){
    $('.topic-content > p').comments({color: '#FFFF00'});

    /* The Browser Sniff is pending*/
    $('.add_comments > div > textarea').click(function(){
        $(this).css('color', '#6c6f74');
    });                                

    var article = $(".article-wrapper"),
        socialBookmarkers = $('.social-bookmarkers'),
        sidebar = article.find('aside'),
        leftSideWidth = 720;
    sidebar.css('left', article.offset().left + leftSideWidth - $(window).scrollLeft());

    $(window).resize(function() {
        var self = $(this);
        socialBookmarkers.data("fixed") == true && socialBookmarkers.css('left', article.offset().left - 30); 
        sidebar.data("fixed") == "true" && sidebar.css('left', article.offset().left + leftSideWidth - self.scrollLeft());
    });

    $('.continue').live('click', function(){
       $(this).closest('.sign-up-or-continue').slideUp(function(){
           var signUp = $(this);      
           console.log(signUp.next().length, signUp.next().attr('class'));
           signUp.next().slideDown();
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
});
