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
    $('input:checkbox').change(function(){                          
        if($(this).is(':checked')){     
            $('.comments').each(function(){       
                var comments = $(this);    
                var id =  comments.attr('id');
                if($('#' +  id +'_clone').length == 0){
                    var link = $('#' + comments.attr('id') + '_link');  
                    var parag = link.parent();
                    var linkOuterHTML = link.attr('outerHTML');                        
                    var chunks = parag.html().split(linkOuterHTML);
                    parag.html(chunks[0] +  linkOuterHTML).after(comments.attr('outerHTML') + '<p>' + chunks[1] + '</p>');
                    parag.next('#' + id).attr('id',  id + '_clone').addClass('clon');
                } 
            });                                     
            $(".comments[id$='clone']").slideDown();
        }                           
        else{                   

            $(".comments[id$='clone']").each(function (){
                var comments = $(this);
                comments.slideUp(function(){                 
                    console.log(1);
                    var paragEnd = comments.next();
                    comments.prev().append(paragEnd.html());
                    paragEnd.remove();
                    comments.remove();
                });
            });
        }
    });
        
    $('.has_comments').live('click', function(e){
        var parag = $(this).parent();
        var post = parag.parent();
        var link = $(this);
        var id = link.attr('id').split('_')[1];
        var comments = $('#comments_' + id + '_clone');
        if(comments.length){
            comments.slideToggle(function(){
                var paragEnd = comments.next();
                parag.append(paragEnd.html());
                paragEnd.remove();
                comments.remove();
            });
        }
        else{
            var linkOuterHTML = link.attr('outerHTML');
            var chunks = parag.html().split(linkOuterHTML);
            parag.html(chunks[0] +  linkOuterHTML).after($('#comments_' + id).attr('outerHTML') + '<p>' + chunks[1] + '</p>');
            parag.next('#comments_' + id).attr('id', 'comments_' + id + '_clone').slideToggle().addClass('clon');
        }
        e.preventDefault();
        return false;
    });
}