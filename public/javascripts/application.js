String.prototype.padLeft = function(n, pad) {
    var t = '';
    if(n > this.length) {
        for(var i = 0; i < n-this.length; i++) {
            t += pad;
        }
    }
    return t+this;
};
String.prototype.padRight = function(n, pad) {
    var t = this;
    if(n > this.length) {
        for(var i = 0; i < n-this.length; i++) {
            t += pad;
        }
    }
    return t.toString();
};

$(document).ready(function() {
    //listen on keystrokes of the query text field
    $("#query").keyup(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13 || code == 32) { //Enter or space keycode
            $.getScript("/search/topics.js?query=" + encodeURIComponent($("#query").val().trim()))
        }
    });

  $('#related_content_form').submit(function(){
    var urlType = RelatedContent.detectType($('#related_content_source_url').val());

    if (urlType == "link" && $(".possible-thumbnails").length == 0 ) {

      $.ajax({
        url: '/admin/topics/'+currentTopicId+'/related_contents.js',
        data: $(this).serialize(),
        dataType: 'script',
        type: 'POST',
      });

      return false;
    }
  });

    $('#related_content_form').submit(function(){
        var urlType = RelatedContent.detectType($('#related_content_source_url').val());

        if (urlType == "link" && $(".possible-thumbnails").length == 0 ) {

            $.ajax({
                url: '/admin/topics/'+currentTopicId+'/related_contents.js',
                data: $(this).serialize(),
                dataType: 'script',
                type: 'POST',
            });

            return false;
        } else if(urlType == "image" && $('#related_content_title').length == 0 ) {
          $('#related_content_form_fields').append('<p>\
              <label for="related_content_title">Title</label>\
              <input id="related_content_title" name="related_content[title]" size="30" type="text">\
            </p>\
          ');
          $('#related_content_form_fields').append('<p>\
              <label for="related_content_description">Description</label>\
              <input id="related_content_description" name="related_content[description]" size="30" type="text">\
            </p>\
          ');
          return false;
        }
    });

    $('.comments .flag').live('click', function () {
        var that = $(this);
        var reply = new Reply({
            id: that.attr('data-value'),
            topic_id: topicId
        });
        reply.flag({
            success: function (r) {
                // TODO: delegate ratings' errors to reply errors so it does trigger error correctly
                that.text('flagged');
            },
            error: function () {
                alert('there was an error');
            }
        });
        return false;
    });

    $('.add_comments:visible input[type=submit]').live('click', function () {
        $(this).parents('.res-types-wrapper').find('.reply_category').val(this.name);
    });

    $('.filter-resposes input:checkbox, #filter_helpful').change(filterResponses);
});

function filterResponses() {
    var cbs = $('.filter-resposes input:checkbox:checked');
    var show_useful = $('#filter_helpful').is(':checked');
    $('.comments.clon li.comment-st-level').hide();
    if(cbs.length === 0) {
        if(show_useful) {
            $('.comments.clon li.comment-st-level.useful').show();
        } else {
            $('.comments.clon li.comment-st-level').show();
        }
    } else {
        cbs.each(function () {
            if(show_useful) {
                $('.comments.clon li.comment-st-level.useful.' + $(this).val()).show();
            } else {
                $('.comments.clon li.comment-st-level.' + $(this).val()).show();
            }
        });
    }
}
