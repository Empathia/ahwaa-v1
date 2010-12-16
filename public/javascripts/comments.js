$.fn.outerHTML = function() {
    return $('<div></div>').append( this.clone() ).html();
}

function calculateArrowsPositions(){
    $('.clon').each(function(){
        var comments = $(this),
            link = comments.prev('p').find('a:last-child');
        comments.find('.comm-arrow:first').css('left', link.position().left);        
    })
}   

function saveState(commentsClon){
    var comments = $('#' + commentsClon.attr('id').replace('_clon', '')),
        indexs = [],                            
        links = commentsClon.find('.icn');
    commentsClon.find('.has_comments.minus').each(function(){  
        indexs.push(links.index($(this)));
    });                             
    comments.data('state', indexs);
}            

function loadState(commentsClon, commentsOriginal){     
    var indexes = commentsOriginal.data('state');
    for (index in indexes){
        commentsClon.find('a:eq(' + indexes[index] + ')').trigger('click');
    }
}

$.fn.slideUpComments = function(parag, link){
    var comments = $(this);
    saveState(comments);
    comments.slideToggle(function(){
        var paragEnd = comments.next();
        paragEnd && parag.append(paragEnd.html()) && paragEnd.remove();
        comments.data('newResponse') ? comments.replaceWith(comments.data('newResponse')) : comments.remove();
        link && link.attr('style', '').removeClass('minus');
        calculateArrowsPositions();
    });
}

$.fn.slideDownComments = function(commentsOriginal){
  var commentsClon = $(this);
  commentsClon.slideDown(function(){
      calculateArrowsPositions();   
      commentsOriginal && loadState(commentsClon, commentsOriginal);
      if (!$.browser.webkit) {
          $('.add_comments.clon:visible textarea.comment_content').attr('placeholder') && $('.add_comments.clon:visible textarea.comment_content').attr('value',$('.add_comments.clon:visible textarea.comment_content').attr('placeholder'));
      }
  }); 
};

$.fn.comments = function(options){                         
    var expandBtn = $('.expand-btn');
    expandBtn.data('label', expandBtn.text()).click(function(e){
        if(expandBtn.hasClass('hide')){
            $(".clon").each(function (){
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
            index = $('.topic-content .icn.' + getLevel(link.attr('class'))).index(this),
            tt = link.find('.tt');
            parentComments = link.closest('.comments.clon');                                                                                 
            parentComments.length && (index = parentComments.attr('id').replace('_clon', '').replace('comments_', '') + '_' + index);
        var comments = parag.next('#comments_' + index +'_clon');
        !comments.length && (comments = parag.next('#comments_add_' + index + '_clon'));
        if(comments.length){
            comments.slideUpComments(parag, link);
            tt.text(I18n.t('topics.show.contextual.reply_here'));
        }
        else{       
            tt.text(I18n.t('topics.show.contextual.hide'));
            var has_comments = link.hasClass('has_comments');
            comments = has_comments ? $('#comments_' + index) : $('#add_comments');
            has_comments && link.addClass('minus');
            link.css('display', 'inline');
            var commentsClon = cloneComments(link, comments.outerHTML(), index, has_comments);
            commentsClon.find('.contextual_index').val(index);
            commentsClon.find('.reply_to').val(commentsClon.closest('li').attr('data-id'));
            commentsClon.slideDownComments(comments);
        }
        return false;
    });                         
    
    function getCommentsSelector(link){
       link.closest('comments') 
    }   
    
    function getLevel(classes){
        classes = classes.split(' ');
        for(var i=0; i<classes.length; i++){
            if(/level/.test(classes[i])){
                return classes[i];
            }
        } 
    }   
    
    
    $('.res-flag-btns').find('.disabled').live('click', function(e){       
        var lk = $(this),
            sign_up = lk.parent().find('.sign-up-tt-wrapper');
        if(sign_up.is(':visible') && lk.hasClass('clicked')){    
            lk.removeClass('clicked');
            sign_up.fadeOut();
        }
        else{     
            lk.siblings('.clicked').removeClass('clicked');
            lk.addClass('clicked');            
            sign_up.css('left', (Math.abs(Math.floor(lk.outerWidth()/2 - sign_up.outerWidth()/2))*-1+lk.position().left)).animate({top : '-110', opacity : 'show'}, 'slow')
        }
        e.preventDefault();
        return false;
    });
    
    $('.useful-lk').live('click', function(){
        var that = $(this);
        if(!that.hasClass('disabled')) {
            var reply = new Reply({
                id: that.attr('data-value'),
                topic_id: topicId
            });
            reply.vote_up({
                success: function (r) {
                    that.addClass('disabled').text(I18n.t('replies.reply.useful'));
                },
                error: function () {
                    that.addClass('disabled').text(I18n.t('replies.reply.already_useful'));
                }
            });
        }
        return false;
    });
     

    $('.flag').live('click', function (e) {
        e.preventDefault();
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

    $('.add_comments.clon:visible textarea.comment_content').live('focus',function(){
        var textarea = $(this);
        if(textarea.val() == 'Click here to write your response.'){
            textarea.val('')
        }
        textarea.blur(function(){
                if(textarea.val().length <= 1 || textarea.val() ==  'Click here to write your response.'){
                    textarea.val('Click here to write your response.');
                }
            })
        }).live('keyup', function () {
        if($(this).siblings('.res-types-wrapper').is(':hidden') && $(this).val()){
            $(this).siblings('.res-types-wrapper').slideDown('slow');
        }
        else if($(this).siblings('.res-types-wrapper').is(':visible') && !$(this).val() ){
            $(this).siblings('.res-types-wrapper').slideUp('slow');
        }
        
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
    }).attr('paceholder', 'nomedigas'); 

    function expandAll(){
        var allComments = [];
        $('.comments:not(.clon)').each(function(){
            var comments = $(this),
                id = comments.attr('id').replace('comments_', '');
            $('#comments_' +  id +'_clon').length == 0 && allComments.push(cloneComments($('#add_' + id), comments.outerHTML(), id, true)[0]);
        });         
       $(allComments).slideDownComments();
       $('.has_comments .tt').text(I18n.t('topics.show.contextual.hide'));
       $('.topic-content .has_comments').addClass('minus');
    } 
    
    function cloneComments(link, comments, index, has_comments){
        var parag = link.parent(),
            linkOuterHTML = link.outerHTML(),
            chunks = parag.html().split(linkOuterHTML),
            left = link.position().left;
        parag.html(chunks[0] +  linkOuterHTML).after(comments + '<p>' + chunks[1] + '</p>');
        comments = parag.next();
        comments.attr('id',  has_comments ? 'comments_' + index + '_clon' : 'comments_add_' + index + '_clon').addClass('clon').hide();
        comments.find('.comm-arrow:first').css('left', left);
        comments.find('p').addMarkers();
        $('.icn.level_2').each(function() {
            var ix = $(this).parents('.comments.clon').find('.icn.level_2').index($(this));
            var id = /comments_(\d+)_clon/.exec($(this).parents('.comments').attr('id'))[1];
            $(this).attr('id', 'add_' + id + '_' + ix);
        });
        return comments;
    }   

    $.fn.addMarkers = function(){
        var i=0,
            parags = this,
            parents = parags.eq(0).parents('.comments'),
            selector = parents.length ? parents.eq(0).attr('id').replace(/clon/, '') : 'comments_',
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
    };
     
    $(this).addMarkers();
    
    $('.icn.level_1').each(function(i){
       $(this).attr('id', 'add_' + i);
    });  

    $('.new-response').live('click', function(e){
        var newResponse = $(this),
            addCommentForm = $('#add_comments').clone(true),
            id = 'add_comment_clon' + new Date().getTime(),
            newResponseClon = newResponse.clone(true),
            index = newResponse.closest('.comments.clon').attr('id').match(/comments_((\w|_)+)_clon/)[1];
        newResponse.hasClass('reply-new-response') && addCommentForm.addClass('reply-new-response');
        addCommentForm.attr('id', id).addClass('clon no-arrow').find('.comm-arrow').remove();
        newResponse.attr('data-type') == 'global' || addCommentForm.find('.contextual_index').val(index);
        newResponse.replaceWith(addCommentForm);
        $('#' + id).data('newResponse', newResponseClon).slideDown().find('textarea').focus();
        // comments.find('.contextual_index').val(index);  
        addCommentForm.find('.reply_to').val(addCommentForm.closest('li').attr('data-id'));  
        // addCommentForm.find('.contextual_index').val(addCommentForm.prev('p').find('a:last-child').attr('id').replace('add_', ''));
        e.preventDefault();
        return false;
    });                                       
    
    $('.reply-to').live('click', function(e){
        var lk = $(this);
        lk.hasClass('clicked') ? lk.removeClass('clicked').next().slideUp() : lk.addClass('clicked').next().slideDown();
        e.preventDefault();        
        return false;
    }).next().addClass('reply-new-response');
    
    $('.comments-ls > li').live('mouseenter mouseleave', function(e){             
        if (e.type == 'mouseenter') {                                              
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
