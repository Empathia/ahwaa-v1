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

    //function to place the extra topic tags into the "more" vertical list

    var ulwidth = $("#header-tags").width();

    $("#header-tags").children().each(function(e) {
        if (ulwidth > 700){
            var overelement = $("#header-tags > li:last-child").prev();
            var newli = '<li>' + overelement.html() + '</li>';
            $("#moretags").prepend(newli);
            overelement.remove();
            ulwidth = $("#header-tags").width();
        }
    });

    $('.comments .flag:not(.disabled)').live('click', function () {
        var that = $(this);
        var reply = new Reply({
            id: that.attr('data-value'),
            topic_id: topicId
        });
        reply.flag({
            success: function (r) {
                that.text('flagged');
            },
            error: function () {
                alert('already flagged');
            }
        });
        return false;
    });
});

