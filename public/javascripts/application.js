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
