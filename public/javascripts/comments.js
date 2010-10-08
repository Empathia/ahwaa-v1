$.fn.outerHTML = function() {
    return $('<div></div>').append( this.clone() ).html();
}

$.fn.comments = function(options){      
    $('.expand-btn').data('label', $('.expand-btn').text());
    $('.expand-btn').click(function(e){                          
        if($(this).hasClass('hide')){
            $(".reply[id$='clone']").each(function (){
                var comments = $(this);
                comments.slideUp(function(){
                    var paragEnd = comments.next();
                    comments.prev().append(paragEnd.html());
                    paragEnd.remove();
                    comments.remove();
                });
            });  
            $(this).text(I18n.t('topics.show.sidebar.show_all_responses')).removeClass('hide');
        }
        else{
            expand();
            $(this).text($(this).data('label')).addClass('hide');
        }
        e.preventDefault();
        return false;
    });
        
    $('.icn-plus').live('click', function(e){
        var link = $(this);        
        var parag = link.parent();         
        var index = $('.topic-content .icn-plus').index(this);
        var comments = parag.next('#comments_' + index + '_clone').length ? parag.next() : parag.next('#comments_add_' + index + '_clone');
        if(comments.length){                                                  
            comments.slideToggle(function(){
                var paragEnd = comments.next();
                parag.append(paragEnd.html());
                paragEnd.remove();
                comments.remove();
                link.attr('style', '').css('backgroundPosition', '0 0');
            });
        }
        else{                       
            var has_comments = link.hasClass('has_comments');                                                          
            comments = has_comments ? $('#comments_' + index).outerHTML() : $('#add_comments').outerHTML();
            has_comments && link.css('backgroundPosition', '0 -19px');
            var linkOuterHTML = link.css('display', 'inline').outerHTML();
            var chunks = parag.html().split(linkOuterHTML);
            parag.html(chunks[0] +  linkOuterHTML).after(comments + '<p>' + chunks[1] + '</p>');
            parag.next().attr('id',  has_comments ? 'comments_' + index + '_clone' : 'comments_add_' + index + '_clone').slideDown().addClass('clon');
        }
        e.preventDefault();
        return false;
    });    
    
    function expand(){
        $('.reply').each(function(){       
            var comments = $(this);    
            var id =  comments.attr('id').split('_')[1];
            if($('#comments_' +  id +'_clone').length == 0){
                var link = $('.topic-content .icn-plus:eq(' + id + ')')                
                var parag = link.parent();
                var linkOuterHTML = link.outerHTML();
                var chunks = parag.html().split(linkOuterHTML);
                parag.html(chunks[0] +  linkOuterHTML).after(comments.outerHTML() + '<p>' + chunks[1] + '</p>');
                parag.next('#comments_' + id).attr('id',  id + '_clone').addClass('clon');
            } 
        });                                     
        $(".reply[id$='clone']").slideDown(); 
    }
    var i=0;
    this.each(function(){                                             
        var parag = $(this);
        var paragHTML= parag.html();
        var exp = /\.((?: [A-Z])|$)/;
        var has_comments = "";     
        while(exp.test(paragHTML)){
            paragHTML = $('#comments_' + i).length ? paragHTML.replace(exp, ". <a href='#' class='icn-plus has_comments' title='" + I18n.t('topics.show.contextual.add_comment') + "'>&nbsp;</a>$1") :
                        paragHTML.replace(exp, "<a href='#' class='icn-plus no_comments' title='" + I18n.t('topics.show.contextual.add_comment') + "'>.</a>$1")            
            i++;
        }
        //paragHTML = paragHTML.replace(/([\?\!;]+) /g, "$1<a href='#' class='icn-plus' title='" + I18n.t('topics.show.contextual.add_comment') + "'> </a>");
        parag.html(paragHTML);
    });                                                                                                                                                    

    $('.icn-plus').each(function(i){
       $(this).attr('id', 'add_' + i);
    });
    
    //expand();    
}
