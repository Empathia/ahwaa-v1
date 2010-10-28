$(document).ready(function() {

  //listen on keystrokes of the query text field
  $("#query").keyup(function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13 || code == 32) { //Enter or space keycode
      $.getScript("/search/topics.js?query="+$("#query").val())
    }
  });
});



