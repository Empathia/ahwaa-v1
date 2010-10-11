$.fn.outerHTML = function() {
    return $('<div></div>').append( this.clone() ).html();
}

$.fn.comments = function(options){      
    $('.expand-btn').data('label', $('.expand-btn').text());
    $('.expand-btn').click(function(e){                          
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
            $(this).text(I18n.t('topics.show.sidebar.show_all_responses')).removeClass('hide');
            $('.topic-content .icn-plus').removeClass('minus');
        }
        else{
            expand();
            $(this).text($(this).data('label')).addClass('hide');
        }
        e.preventDefault();
        return false;
    });
        
    $('.icn-plus').live('click', function(e){
        var link = $(this), 
            parag = link.parent(), 
            index = $('.topic-content .icn-plus').index(this),
            comments = parag.next('#comments_' + index + '_clone').length ? parag.next() : parag.next('#comments_add_' + index + '_clone');
        if(comments.length){   
            slideUpComments(comments, parag, link);                                               
        }
        else{                       
            var has_comments = link.hasClass('has_comments');                                                          
            comments = has_comments ? $('#comments_' + index).outerHTML() : $('#add_comments').outerHTML();
            has_comments && link.addClass('minus');
            var linkOuterHTML = link.css('display', 'inline').outerHTML(),
                chunks = parag.html().split(linkOuterHTML);
            parag.html(chunks[0] +  linkOuterHTML).after(comments + '<p>' + chunks[1] + '</p>');
            parag.next().attr('id',  has_comments ? 'comments_' + index + '_clone' : 'comments_add_' + index + '_clone').slideDown().addClass('clon');
        }
        e.preventDefault();
        return false;
    });    
    
    $('.cancel-comment').live('click', function(e){   
        var comments = $(this).closest('.add_comments');
        slideUpComments(comments, comments.prev());
        e.preventDefault();
        return false;        
    })               
    
    function slideUpComments(comments, parag, link){
        comments.slideToggle(function(){
            var paragEnd = comments.next();
            parag.append(paragEnd.html());
            paragEnd.remove();
            comments.remove();
            link && link.attr('style', '').removeClass('minus');
        }); 
    }   
    
    function expand(){
        $('.comments').each(function(){       
            var comments = $(this),   
                id =  comments.attr('id').split('_')[1];
            if($('#comments_' +  id +'_clone').length == 0){
                var link = $('.topic-content .icn-plus:eq(' + id + ')'),
                    parag = link.parent(),
                    linkOuterHTML = link.outerHTML(),
                    chunks = parag.html().split(linkOuterHTML);
                parag.html(chunks[0] +  linkOuterHTML).after(comments.outerHTML() + '<p>' + chunks[1] + '</p>');
                parag.next('#comments_' + id).attr('id',  id + '_clone').addClass('clon');
            } 
        });                                     
        $(".comments[id$='clone']").slideDown();    
        $('.topic-content .icn-plus').addClass('minus');
    }
    var i=0;
    this.each(function(){                                             
        var parag = $(this),
            paragHTML= parag.html(),
            exp = /\.((?: [A-Z])|$)/,
            has_comments = "";     
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
    
    $('.new-response').live('click', function(e){
        var addCommentForm = $('#add_comments').clone(true),
            id = 'add_comment_clone';
        addCommentForm.attr('id', id);
        $(this).replaceWith(addCommentForm);
        $('#' + id).slideDown().find('textarea').focus(); 
        e.preventDefault();
        return false;
    });
    
    $()
    //expand();    
}
