// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$.fn.selectText = function(){
	var selection = '';                     
	var range = '';
	if (window.getSelection) {
        selection = window.getSelection();
        range = selection.getRangeAt(0);
	} else if (document.getSelection) {
        selection = document.getSelection();
        range = selection.getRangeAt(0);
	} else if (document.selection) {
        selection = document.selection;
        range = createRange();
	}
 	var ranges = $(this).data('ranges') || new Array();
 	if(ranges.length){
 	    console.log(ranges[0]); 
 	}
 	else{
 	    ranges.push({start : range.startOffset, end : range.endOffset, text : range.toString()});
 	}                                                                                            
 	console.log(ranges[0].text);
    
    //console.log(range.startOffset);
    //console.log(range.endOffset);
    //console.log($(this).text());
    /*
    var selectionContents = range.extractContents();
    var span = document.createElement("span");
    span.style.color = "yellow";
    span.appendChild(selectionContents);
    range.insertNode(span);
    */
}

$.fn.comments = function(options){
    return this.each(function(){
        $(this).mouseup(function(){
            $(this).selectText();
        });
    });       
}

$(function(){
    $('p').comments();}
);