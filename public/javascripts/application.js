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
        var val = $.trim($(this).val());
        if(!searching && val.length) {
            searching = true;
            setTimeout(function() {
                $.getScript("/search/topics.js?query=" + encodeURIComponent(val), function () {
                    searching = false;
                });
            }, 500);
        }
    });

    //[Admin] listen to the profile match fomr select tags to filter results dinamically
    $('#profile_match_filters_form').find('select').change(function(){
      getProfileTopicMatches();
    });

    $('<img />').attr('src', '/images/loading-s-gray.gif');
    $('<img />').attr('src', '/images/loading-s-white.gif');
    
});



function getProfileTopicMatches() {
  var form = $('#profile_match_filters_form');
  $.ajax({
    url: '/admin/topics/'+currentTopicId+'/profile_matches/list_matches.js',
    data: form.serialize(),
    dataType: 'script',
    type: 'POST'
  });
}
