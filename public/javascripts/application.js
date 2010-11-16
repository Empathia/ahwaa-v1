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

});

