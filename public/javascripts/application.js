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

var searching = false;

$(document).ready(function() {
    //listen on keystrokes of the query text field
    $("#query").keyup(function(e) {
        if(!searching && $(this).val()) {
            searching = true;
            setTimeout(function() {
                $.getScript("/search/topics.js?query=" + encodeURIComponent($.trim($("#query").val())), function () {
                    searching = false;
                });
            }, 1000);
        }
    });

    //[Admin] listen to the profile match fomr select tags to filter results dinamically
    $('#profile_match_filters_form').find('select').change(function(){
      getProfileTopicMatches();
    });

    //[Admin] checks related content url to handle special cases
    $('#related_content_form').submit(function(){
        var urlType = RelatedContent.detectType($('#related_content_source_url').val());
        if (urlType == "link" && $(".possible-thumbnails").length == 0 ) {

            $.ajax({
                url: '/admin/topics/'+currentTopicId+'/related_contents.js',
                data: $(this).serialize(),
                dataType: 'script',
                type: 'POST'
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
                                                    
    $('.add_comments:visible input[type=submit]').live('mouseover', function () {
        $(this).parents('.res-types-wrapper').find('.reply_category').val(this.name);
    });
    
    $('<img />').attr('src', '/images/loading-s.gif');            
    
    $('.add_comments:visible input[type=submit]').live('click', function(){
        $(this).parents('.res-types-wrapper').find('.res-lbl').addClass('loading');        
    });
    
    $('.filter-resposes input:checkbox, #filter_helpful').change(filterResponses);
});

function filterResponses() {
    var cbs = $('.filter-resposes input:checkbox:checked'),
        show_useful = $('#filter_helpful').is(':checked'),
        comments_ls = $('.comments.clon .comments-ls');
    //collapseAllComments();
    
    comments_ls.children().hide();
    if(cbs.length === 0) {
        comments_ls.children((show_useful ? '.useful' : '')).slideDown();
    } else {
        cbs.each(function () {
            comments_ls.children((show_useful ? '.useful.' : '.') + $(this).val()).slideDown();
        });
    };
    comments_ls.each(function(){                                                                  
        console.log($(this).children(':visible').length);                         
        var comments = $(this).closest('.comments'),
            index = comments.attr('id').match(/comments_((\w|_)+)_clon/)[1],
            link = $('#add_' + index);
        $(this).children(':visible').length == 0 && comments.slideUpComments(link.parent(), link);
    });
}

function getProfileTopicMatches() {
  var form = $('#profile_match_filters_form');
  $.ajax({
    url: '/admin/topics/'+currentTopicId+'/profile_matches/list_matches.js',
    data: form.serialize(),
    dataType: 'script',
    type: 'POST'
  });
}
