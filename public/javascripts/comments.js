$.fn.outerHTML = function() {
    return $('<div></div>').append( this.clone() ).html();
}


function slideUpComments(comments, parag, link){
    comments.slideToggle(function(){
        var paragEnd = comments.next();
        paragEnd && parag.append(paragEnd.html()) && paragEnd.remove();
        comments.data('newResponse') ? comments.replaceWith(comments.data('newResponse')) : comments.remove();
        link && link.attr('style', '').removeClass('minus');
    });
}

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
            index = $('.topic-content .icn').index(this),
            comments = parag.next('#comments_' + index + '_clone').length ? parag.next() : parag.next('#comments_add_' + index + '_clone'),
            tt = link.find('.tt');
        if(comments.length){
            slideUpComments(comments, parag, link);
            tt.text(I18n.t('topics.show.contextual.reply_here'));
        }
        else{
            tt.text(I18n.t('topics.show.contextual.hide'));
            var has_comments = link.hasClass('has_comments');
            comments = has_comments ? $('#comments_' + index).outerHTML() : $('#add_comments').outerHTML();
            has_comments && link.addClass('minus');
            link.css('display', 'inline');
            comments = cloneComments(link, comments, index, has_comments);
            comments.slideDown();
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
        slideUpComments(comments, comments.prev());
        comments.find('.error').text('');
        e.preventDefault();
        return false;
    })

    function expandAll(){
        var allComments = [];
        $('.comments').each(function(){
            var comments = $(this),
                id =  comments.attr('id').split('_')[1];
            $('#comments_' +  id +'_clone').length == 0 && allComments.push(cloneComments($('.topic-content .icn:eq(' + id + ')'), comments.outerHTML(), id, true)[0]);
        });
       $(allComments).slideDown();
       $('.has_comments .tt').text(I18n.t('topics.show.contextual.hide'));
       $('.topic-content .icn').addClass('minus');
    } 
    
    function cloneComments(link, comments, index, has_comments){
        var parag = link.parent(),
            linkOuterHTML = link.outerHTML(),
            chunks = parag.html().split(linkOuterHTML),
            left = link.position().left;
        parag.html(chunks[0] +  linkOuterHTML).after(comments + '<p>' + chunks[1] + '</p>');
        comments = parag.next();
        comments.attr('id',  has_comments ? 'comments_' + index + '_clone' : 'comments_add_' + index + '_clone').addClass('clon');
        comments.find('.comm-arrow:first').css('left', left);
        comments.find('.contextual_index').val(index);
        return comments;
    }   
    
    var i=0;
    this.each(function(){
        var parag = $(this),
            paragHTML= parag.html(),
            exp = /\.((?: [A-Z])|$)/,
            has_comments = "";
        while(exp.test(paragHTML)){
            paragHTML = $('#comments_' + i).length ? paragHTML.replace(exp, ". <a href='#' class='icn has_comments' title='" + I18n.t('topics.show.contextual.add_comment') + "'>&nbsp;<span><span class='tt'>" + I18n.t('topics.show.contextual.reply_here') + "</span><span class='tta'></span></span></a>$1") :
                        paragHTML.replace(exp, "<a href='#' class='icn no_comments' title='" + I18n.t('topics.show.contextual.add_comment') + "'>.<span><span class='tt'>" + I18n.t('topics.show.contextual.reply_here') + "</span><span class='tta'></span></span></a>$1")
            i++;
        }
        //paragHTML = paragHTML.replace(/([\?\!;]+) /g, "$1<a href='#' class='icn' title='" + I18n.t('topics.show.contextual.add_comment') + "'> </a>");
        parag.html(paragHTML);
    });

    $('.icn').each(function(i){
       $(this).attr('id', 'add_' + i);
    });

    $('.new-response').live('click', function(e){
        var newResponse = $(this),
            addCommentForm = $('#add_comments').clone(true),
            id = 'add_comment_clone' + new Date().getTime(),
            newResponseClon = newResponse.clone(true),
            index = newResponse.parents('.comments.clon').attr('id').match(/comments_(\d+)_clone/)[1];
        addCommentForm.attr('id', id).find('.contextual_index').val(index);

        $(this).replaceWith(addCommentForm);
        $('#' + id).data('newResponse', newResponseClon).slideDown().find('textarea').focus();
        e.preventDefault();
        return false;
    });

    //expandAll();
};
