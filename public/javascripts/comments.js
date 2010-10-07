$.fn.comments = function(options){      
    $('.expand-btn').data('label', $('.expand-btn').text());
    $('.expand-btn').click(function(){                          
        if($(this).hasClass('hide')){
            $(".comments[id$='clone']").each(function (){
                var comments = $(this);
                comments.slideUp(function(){
                    var paragEnd = comments.next();
                    comments.prev().append(paragEnd.html());
                    paragEnd.remove();
                    comments.remove();
                });
            });  
            $(this).text(I18n.t('topics.show.sidebar.show_all_responses'));
        }
        else{
            expand();
            $(this).text($(this).data('label'));
        }
    });
        
    $('.icn-plus').live('click', function(e){
        var parag = $(this).parent();
        var link = $(this);         
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
            comments = has_comments ? $('#comments_' + index).attr('outerHTML') : $('#add_comments').attr('outerHTML');
            console.log(comments);                           
            has_comments && link.css('backgroundPosition', '0 -19px');
            var linkOuterHTML = link.css('display', 'inline').attr('outerHTML');
            var chunks = parag.html().split(linkOuterHTML);
            parag.html(chunks[0] +  linkOuterHTML).after(comments + '<p>' + chunks[1] + '</p>');
            parag.next().attr('id',  has_comments ? 'comments_' + index + '_clone' : 'comments_add_' + index + '_clone').slideDown().addClass('clon');
        }
        e.preventDefault();
        return false;
    });    
    
    function expand(){
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
