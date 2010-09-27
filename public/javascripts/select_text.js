$.fn.selectText = function(color){ 
    var range, sel;
    if (window.getSelection) { // Non-IE case
        sel = window.getSelection();
        if (sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    
        if ( !document.execCommand("HiliteColor", false, color) ) { // Use HiliteColor since some browsers apply BackColor to the whole block
            document.execCommand("BackColor", false, color);
        }
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange) { // IE case
        range = document.selection.createRange();
        range.execCommand("BackColor", false, color);
    }
} 

$.fn.highlight = function(options){
    $('input:checkbox').change(function(){        
        $(this).is(':checked') ? _parags.find('span').css('backgroundColor', options.color) : _parags.find('span').css('backgroundColor', 'transparent');
    });
}    

$.fn.comments = function(options){      
    var _parags = $(this); 
    $('input:checkbox').change(function(){          
        $(this).is(':checked') ? _parags.find('.comments').removeClass('hidden') : _parags.find('.comments').addClass('hidden');
    });
    return this.each(function(){
        var parag = $(this);      
        /*
        parag.mouseup(function(){
            parag.selectText(options.color);
        });    
        */        
        parag.find('.has_comments').live('click', function(e){    
            var link = $(this);
            var id = link.attr('id').split('_')[1];              
            $.ajax({
               type: "GET", 
               url: "comments.html?id=" + id, 
               success: function(data){     
                 var comments = $('#comments_' + id);
                 if(comments.length){             
                    comments.slideToggle(function(){
                        //comments.toggleClass('hidden'); 
                    });
                 }
                 else{                                                      
                     console.log('hola');
                     console.log($('.comments').length);                    
                    var linkOuterHTML = link.attr('outerHTML');  
                    var chunks = parag.html().split(linkOuterHTML);
                    parag.html(chunks[0] +  linkOuterHTML).after(data + '<p>' + chunks[1] + '</p>');
                    parag.next('.comments').slideToggle();
                 } 
               }
            });
            e.preventDefault();
            return false;
        });
    });       
}