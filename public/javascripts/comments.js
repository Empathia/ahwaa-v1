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
            var linkOuterHTML = link.css('display', 'inline').outerHTML(),
                chunks = parag.html().split(linkOuterHTML),
                left = link.position().left;
            parag.html(chunks[0] +  linkOuterHTML).after(comments + '<p>' + chunks[1] + '</p>');

            comments = parag.next();
            comments.attr('id',  has_comments ? 'comments_' + index + '_clone' : 'comments_add_' + index + '_clone');
            comments.find('.comm-arrow:first').css('left', left + 'px');
            comments.slideDown().addClass('clon');
            comments.find('.contextual_index').val(index);
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

    function expand(){
        $('.comments').each(function(){
            var comments = $(this),
                id =  comments.attr('id').split('_')[1];
            if($('#comments_' +  id +'_clone').length == 0){
                var link = $('.topic-content .icn-plus:eq(' + id + ')'),
                    parag = link.parent(),
                    linkOuterHTML = link.outerHTML(),
                    chunks = parag.html().split(linkOuterHTML);
                var left = link.position().left;
                parag.html(chunks[0] +  linkOuterHTML).after(comments.outerHTML() + '<p>' + chunks[1] + '</p>');
                parag.next('#comments_' + id).attr('id',  id + '_clone').addClass('clon').find('.comm-arrow:first').css('left', left + 'px');
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
            paragHTML = $('#comments_' + i).length ? paragHTML.replace(exp, ". <a href='#' class='icn-plus has_comments' title='" + I18n.t('topics.show.contextual.add_comment') + "'>&nbsp;<span><span class='tt'>" + I18n.t('topics.show.contextual.reply_here') + "</span><span class='tta'></span></span></a>$1") :
                        paragHTML.replace(exp, "<a href='#' class='icn-plus no_comments' title='" + I18n.t('topics.show.contextual.add_comment') + "'>.<span><span class='tt'>" + I18n.t('topics.show.contextual.reply_here') + "</span><span class='tta'></span></span></a>$1")
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
            id = 'add_comment_clone' + new Date().getTime(),
            newResponse = $(this).clone(true),
            index = $(this).parents('.comments.clon').attr('id').match(/comments_(\d+)_clone/)[1];
        addCommentForm.attr('id', id).find('.contextual_index').val(index);

        $(this).replaceWith(addCommentForm);
        $('#' + id).data('newResponse', newResponse).slideDown().find('textarea').focus();
        e.preventDefault();
        return false;
    });

    //expand();
};
