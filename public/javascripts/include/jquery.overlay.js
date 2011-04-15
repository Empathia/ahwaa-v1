$.fn.overlay = function(options){
    return this.each(function(){ 
        var overlay = $(options.href),
            closeBtn = overlay.find('.close'),
            win = $(window);
        
        function displayHTML(){                        
           calculatePosition();
           overlay.fadeIn(); 
           closeBtn.click(function(){
               closeOverlay();
           });
        };
        
        function calculatePosition(){                                
           var top = (win.height() -  overlay.outerHeight()) / 2,
               left = (win.width() - overlay.outerWidth()) / 2,
               deltaY = closeBtn.length && closeBtn.css('top') && closeBtn.css('top') != 'auto' ? Math.abs(parseInt(closeBtn.css('top'))) : 0;
           overlay.css({left: left > 0 ? left : 0, top: top > 0 ? top : deltaY});  
        };
        
        function closeOverlay(){
            overlay.fadeOut(function(){
                $('.opacityWrapper').fadeOut(function(){
					$('#pageslide-body-wrap').css('position', '');
                    $(this).remove();
                });
            });
        };
        
        function bindDocumentClick(){
            $(document).click(function(e){                           
                var target = $(e.target);
                target.hasClass('opacityWrapper') && closeOverlay();
            });
        };
        
        win.resize(function(){
            calculatePosition();
        });
        
        $(this).bind('clickOverlay', function() {
                $('<div>').addClass('opacityWrapper').appendTo('body').fadeIn('slow', function(){
                    options.href && displayHTML();
                    bindDocumentClick();
                });
        });
    });
};