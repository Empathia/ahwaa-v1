$.fn.outerHTML = function() {
    return $('<div></div>').append( this.clone() ).html();
}

function calculateArrowsPositions(){
    $('.comments.clon').each(function(){
        var comments = $(this),
            link = comments.prev('p').find('a:last-child');
        comments.find('.comm-arrow:first').css('left', link.position().left);        
    })
}   

$.fn.slideUpComments = function(parag, link){
    var comments = $(this);
    comments.slideToggle(function(){
        var paragEnd = comments.next();
        paragEnd && parag.append(paragEnd.html()) && paragEnd.remove();
        comments.data('newResponse') ? comments.replaceWith(comments.data('newResponse')) : comments.remove();
        link && link.attr('style', '').removeClass('minus');
        calculateArrowsPositions();
    });
}

$.fn.slideDownComments = function(){
  this.slideDown(function(){
      calculateArrowsPositions();
  }); 
};

$.fn.comments = function(options){                         
    var expandBtn = $('.expand-btn');
    expandBtn.data('label', expandBtn.text()).click(function(e){
        if(expandBtn.hasClass('hide')){
            $(".comments[id$='clone']").each(function (){
                var comments = $(this);
                comments.slideUp(function(){
                    var paragEnd = comments.next();
                    comments.prev().append(paragEnd.html());
                    paragEnd.remove();
                    comments.remove();
                });
            });
            expandBtn.text(I18n.t('topics.show.sidebar.show_all_responses')).removeClass('hide');
            $('.topic-content .icn').removeClass('minus');
        }
        else{
            expandAll();
            expandBtn.text(expandBtn.data('label')).addClass('hide');
        }
        e.preventDefault();
        return false;
    });

    $('.icn').live('click', function(e){
        var link = $(this),
            parag = link.parent(),
            index = $('.topic-content .icn.level_1').index(this),
            comments = parag.next('#comments_' + index + '_clone').length ? parag.next() : parag.next('#comments_add_' + index + '_clone'),
            tt = link.find('.tt');
        if(comments.length){
            comments.slideUpComments(parag, link);
            tt.text(I18n.t('topics.show.contextual.reply_here'));
        }
        else{
            tt.text(I18n.t('topics.show.contextual.hide'));
            var has_comments = link.hasClass('has_comments');
            comments = has_comments ? $('#comments_' + index).outerHTML() : $('#add_comments').outerHTML();
            has_comments && link.addClass('minus');
            link.css('display', 'inline');
            comments = cloneComments(link, comments, index, has_comments);
            comments.slideDownComments();
        }
        return false;
    });                         
    
    $('.useful').live('click', function(){
        var that = $(this);
        if(!that.hasClass('disabled')) {
            var reply = new Reply({
                id: that.attr('data-value'),
                topic_id: topicId
            });
            reply.vote_up({
                success: function (r) {
                    that.text(I18n.t('replies.reply.useful')).addClass('disabled');
                },
                error: function () {
                    that.text(I18n.t('replies.reply.already_useful')).addClass('disabled');
                }
            });
        }
        return false;
    });

    $('.flag').live('click', function () {
        var that = $(this);
        if(!that.hasClass('disabled')) {
            var reply = new Reply({
                id: that.attr('data-value'),
                topic_id: topicId
            });
            reply.flag({
                success: function (r) {
                    that.addClass('disabled').find('span').text(I18n.t('replies.reply.flagged'));
                },
                error: function () {
                    that.addClass('disabled').find('span').text(I18n.t('replies.reply.already_flagged'));
                }
            });
        }
        return false;
    });

    $('.cancel-comment').live('click', function(e){
        var comments = $(this).closest('.add_comments');
        comments.slideUpComments(comments.prev());
        comments.find('.error').text('');
        e.preventDefault();
        return false;
    });

    $('.add_comments.clon:visible textarea.comment_content').live('keyup', function () {
        for(var i = 0; i < badWords.length; i++) {
            var reg = new RegExp(badWords[i], 'ig');
            if(reg.test($(this).val())) {
                var replacement = $(this).val().replace(reg, ''.padLeft(badWords[i].length, '*'));
                $(this).val(replacement);
            }
        }
    }).live('keypress', function(e){
        var textarea = $(this);
        e.keyCode == '13' && textarea.height(textarea.height() + 13);
    }); 

    function expandAll(){
        var allComments = [];
        $('.comments').each(function(){
            var comments = $(this),
                idChunks =  comments.attr('id').split('_');             
            idChunks.shift();
            var id = idChunks.join('_'),
                index = idChunks[idChunks.length-1];
            $('#comments_' +  id +'_clone').length == 0 && allComments.push(cloneComments(getLink(idChunks, 1), comments.outerHTML(), id, true)[0]);
        });         
       $(allComments).slideDownComments();
       $('.has_comments .tt').text(I18n.t('topics.show.contextual.hide'));
       $('.topic-content .has_comments').addClass('minus');
    } 
    
    function getLink(idChunks, level){
        while(idChunks.length){
            var id = idChunks.pop();
            if(idChunks.length > 0){
                return getLink(idChunks, ++level)
            }                    
            return $('.topic-content .icn.level_' + level + ':eq(' + id + ')');
        } 
    }
    
    function cloneComments(link, comments, index, has_comments){
        var parag = link.parent(),
            linkOuterHTML = link.outerHTML(),
            chunks = parag.html().split(linkOuterHTML),
            left = link.position().left;
        parag.html(chunks[0] +  linkOuterHTML).after(comments + '<p>' + chunks[1] + '</p>');
        comments = parag.next();
        comments.attr('id',  has_comments ? 'comments_' + index + '_clone' : 'comments_add_' + index + '_clone').addClass('clon').hide();
        comments.find('.comm-arrow:first').css('left', left);
        comments.find('.contextual_index').val(index);  
        comments.find('p').addMarkers();
        return comments;
    }   

    $.fn.addMarkers = function(){
        var i=0,
            parags = this,
            parents = parags.eq(0).parents('.comments'),
            selector = parents.length ? parents.eq(0).attr('id').replace(/clone/, '') : 'comments_',
            level = parents.length + 1;
        parags.each(function(){
            var parag = $(this),
                paragHTML= parag.html(),
                exp = /\.((?: [A-Z])|$)/,
                has_comments = "";
            while(exp.test(paragHTML)){ 
                paragHTML = $('#' + selector + i).length ? paragHTML.replace(exp, ". <a href='#' class='icn level_" + level + " has_comments' title='" + I18n.t('topics.show.contextual.add_comment') + "'>&nbsp;<span><span class='tt'>" + I18n.t('topics.show.contextual.reply_here') + "</span><span class='tta'></span></span></a>$1") :
                            paragHTML.replace(exp, "<a href='#' class='icn level_" + level + " no_comments' title='" + I18n.t('topics.show.contextual.add_comment') + "'>.<span><span class='tt'>" + I18n.t('topics.show.contextual.reply_here') + "</span><span class='tta'></span></span></a>$1")
                i++;
            }
            //paragHTML = paragHTML.replace(/([\?\!;]+) /g, "$1<a href='#' class='icn' title='" + I18n.t('topics.show.contextual.add_comment') + "'> </a>");
            parag.html(paragHTML);
       });
    }
     
    $(this).addMarkers();
    
    $('.icn.level_1').each(function(i){
       $(this).attr('id', 'add_' + i);
    });

    $('.new-response').live('click', function(e){
        var newResponse = $(this),
            addCommentForm = $('#add_comments').clone(true),
            id = 'add_comment_clone' + new Date().getTime(),
            newResponseClon = newResponse.clone(true),
            index = newResponse.parents('.comments.clon').attr('id').match(/comments_(\d+)_clone/)[1];
        addCommentForm.attr('id', id).addClass('clon').find('.contextual_index').val(index).end().find('.comm-arrow').remove();
        newResponse.replaceWith(addCommentForm);
        $('#' + id).data('newResponse', newResponseClon).slideDown().find('textarea').focus();
        e.preventDefault();
        return false;
    });
    
    $('.comments-ls > li').live('mouseover mouseout', function(e){             
        if (event.type == 'mouseover') {
            $(this).children('.res-flag-btns').show();
        } else {
            $('.sign-up-tt-wrapper').hide();
            $(this).children('.res-flag-btns').hide();
        }
        e.stopPropagation();
        return false;
    });
    
    setTimeout(function(){
        expandBtn.trigger('click');
    }, 0);
};
