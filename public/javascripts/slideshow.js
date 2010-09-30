$.fn.blockSlider = function(options){
	return this.each(function(){
		options = $.extend({
			auto: false,
			anim: 'carrousel',
			speed: 1000,
			pause: 4000,
			nav: false,
			navSelector: '',  
			arrows: true,
			nxt: '.next',
			bck: '.back'
		}, options);
		var slider = $(this);
		var wrapper = options.anim == 'carrousel' ? slider.parent().parent() : slider.parent();
		var slides = slider.children();
		var size = slides.length;
		slides.filter(':first').addClass('active');                                       
		var animations = { 
		    start: function(){
                slider.data('id', setInterval(animations[options.anim], options.pause));
		    },
		    fade: function(){
    			var currentItem = slides.filter('.active:first').index();
    			slides.eq(currentItem).fadeOut(options.speed, function(){
    				slides.each(function(i){
    					$(this).css('z-index', ((size - i) + currentItem) % size);
    				}).removeClass('active').show();
    				var next = ++currentItem % size;
    				slides.eq(next).addClass('active');
    				nav && nav.children().removeClass('active').eq(next).addClass('active');
    			});
    		},
    		arrowsfade: function(delta){
				wrapper.find(options.nxt).click(function(){   
                 animations.resetFade(1);
				});
				wrapper.find(options.bck).click(function(){   
                 animations.resetFade(-1);
				});
			},
			resetFade: function(delta){
                clearInterval(slider.data('id'));
                var currentItem = slides.filter('.active:first').index();
                slides.eq(currentItem).stop(true).css('opacity', '1').removeClass('active');
                slides.css('z-index', 0).eq((currentItem+delta) % size).css('z-index', size+1).addClass('active');
                slides.eq((currentItem + (delta>0 ? 2 : 0)) % size).css('z-index', size);  
                animations.start();
                nav && nav.children().eq(currentItem).removeClass('active').end().eq((currentItem+delta) % size).addClass('active'); 
			},
			navfade: function(){       
    			nav.children().each(function(i){
    				$(this).click(function(){
    					clearInterval(slider.data('id'));
    					slides.eq(slides.filter('.active:first').index()).stop(true).css('opacity', '1').removeClass('active');
    					$(this).addClass('active').siblings('.active').removeClass('active');
    					slides.css('z-index', 0).eq(i).css('z-index', size+1).addClass('active');
    					slides.eq((i+1) % size).css('z-index', size);
    					animations.start();
    				});
    			}).eq(0).addClass('active');
    		},                       
		    carrousel: function(delta){
		        var currentItem = slides.filter('.active:first').index();
		        var next = !delta || (delta > 0) ? (currentItem+1) % size : (currentItem-1 < 0) ? size-1 : currentItem-1;
    			var left = next * slides.eq(0).outerWidth(true) * -1;                              
    			slider.animate({'left' : (slider.parent().width() > slider.outerWidth() + left) ? 0 : left}, 1000, function(){
    				nav && nav.children().eq(currentItem).removeClass('active').end().eq(next).addClass('active');
    				slides.eq(currentItem).removeClass('active').end().eq(next).addClass('active');
    			}); 
		    },
    		resetCarr: function(delta){
    		    clearInterval(slider.data('id'));
                animations.carrousel(delta);                                                
                animations.start();
    		},
			arrowscarrousel: function(){
				wrapper.find(options.nxt).click(function(){
				    animations.resetCarr(1);
				});
				wrapper.find(options.bck).click(function(){
				    animations.resetCarr(-1);
				});
			},
			navcarrousel: function(){       
			    nav.children().each(function(i){
    				$(this).click(function(){
    					clearInterval(slider.data('id'));
    					animations.start();
    				});
    			}).eq(0).addClass('active');
    		},
    		addNav: function(){
                var nav = $('<ul class="nav">');                               
    			var bullets = "";                                              
    			for(var i=0; i<size; i++){
    				bullets += '<li></li>';
    			}                                                                     
    			nav.html(bullets).wrap('<div class="nav-wrapper">').parent().insertAfter(options.anim == 'fade' ? slider : slider.parent());
    			return nav; 
    		}
        }
		options.auto && animations.start();
		var nav = options.nav ? (options.navSelector ? wrapper.find(options.navSelector) : animations.addNav()) : false;
		nav && animations['nav'+options.anim](); 		
	    options.arrows && animations['arrows'+ options.anim]();
	    if(options.anim == 'carrousel'){
	        var width = 0;
	        slides.each(function(){
                width += $(this).outerWidth(true);
    	    });
    	    slider.width(width);   
	    }
	});
}