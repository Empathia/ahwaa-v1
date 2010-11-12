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
      
      var maxwidth = 700;
      var ulwidth = $("#header-tags").width();
      var ulelements = $("#header-tags").children();
      var overelement;
      var newli;
      
      ulelements.each(function(e) {
          if (ulwidth > maxwidth){
              overelement = $("#header-tags > li:last-child").prev();
			  newli = '<li>' + overelement.html() + '</li>';
		      $("#moretags").prepend(newli);
			  overelement.remove();
              ulwidth = $("#header-tags").width();
          }
        })
});

