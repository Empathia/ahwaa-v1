$.fn.blockSlider = function(options){  
	return this.each(function(){
		options = $.extend({
			auto: false,
			anim: 'carrousel',
			circ: false,
			speed: 2000,
			pause: 8000,
			nav: false,
			navSelector: '',  
			arrows: true,
			nxt: '.next',
			bck: '.back',
			delay: 0
		}, options);
		var slider = $(this), 
		             wrapper = options.anim == 'carrousel' ? slider.parent().parent() : slider.parent(), 
		             slides = slider.children(), 
		             size = slides.length;
		slides.filter(':first').addClass('active');                             
		if(options.anim == 'carrousel'){
	        var width = 0;
	        slides.each(function(){
                width += $(this).outerWidth(true);
    	    });
    	    slider.width(width);
    		options.arrows && slider.parent().width() >= slider.outerWidth() + parseInt(slider.css('left')) ? $(options.nxt).removeClass('active') : $(options.nxt).addClass('active');
	    }
		var animations = { 
		    start: function(){        
                options.to ? animations.timeOut() : options.auto && slider.data('id', setInterval(animations[options.anim], options.pause));
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
		        var currentItem = slides.filter('.active:first').index();       ;
		        if(!delta || (delta > 0)){
                    if(slider.parent().width() >= slider.outerWidth() + parseInt(slider.css('left'))){
                        if(!options.circ){ 
                            return false;
                        }            
                        var next = 0;
                    }else{     
                        var next = currentItem+1;
                    }
		        }
		        else {                                                  
                    if(currentItem-1 < 0){
                        if(!options.circ){ 
                            return false;
                        }                                                                                  
                        var next = size-Math.floor(slider.parent().width() / slides.eq(0).outerWidth(true));
                    }
                    else{           
                        var next = currentItem-1;
                    }
		        }                                                   
		        var left = parseInt(slider.css('left')) + (delta > 0 ? (slides.eq(currentItem).outerWidth(true) * -1) : (slides.eq(next).outerWidth(true)));
			    slider.animate({'left' : left}, 1000, function(){
                    nav && nav.children().eq(currentItem).removeClass('active').end().eq(next).addClass('active');
		            slides.eq(currentItem).removeClass('active').end().eq(next).addClass('active');
		            if(options.arrows){             
		                slider.parent().width() >= slider.outerWidth() + parseInt(slider.css('left')) ? $(options.nxt).removeClass('active') : $(options.nxt).addClass('active');
		                next == 0 ? $(options.bck).removeClass('active') : $(options.bck).addClass('active');
		            }
                });
		    },
    		resetCarr: function(delta){
    		    clearInterval(slider.data('id'));
                animations.carrousel(delta);      
                options.auto && animations.start();                                 
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
    					options.auto && animations.start();
    				});
    			}).eq(0).addClass('active');
    		},
    		addNav: function(){
                var nav = $('<ul class="nav">'),
                    bullets = "";                                              
    			for(var i=0; i<size; i++){
    				bullets += '<li></li>';
    			}                                                                     
    			nav.html(bullets).wrap('<div class="nav-wrapper">').parent().insertAfter(options.anim == 'fade' ? slider : slider.parent());
    			return nav; 
    		}
        }
        setTimeout(animations.start, options.delay);
		var nav = options.nav ? (options.navSelector ? wrapper.find(options.navSelector) : animations.addNav()) : false;
		nav && animations['nav'+options.anim](); 		
	    options.arrows && animations['arrows'+ options.anim]();
	});
}