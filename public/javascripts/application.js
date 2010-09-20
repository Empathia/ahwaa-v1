// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$.fn.selectText = function(){ 
        var colour = "yellow";
        var range, sel;
        if (window.getSelection) {
            // Non-IE case
            sel = window.getSelection();
            if (sel.getRangeAt) {
                range = sel.getRangeAt(0);
            }
            document.designMode = "on";
            if (range) {
                sel.removeAllRanges();
                sel.addRange(range);
            }
            // Use HiliteColor since some browsers apply BackColor to the whole block
            if ( !document.execCommand("HiliteColor", false, colour) ) {
                document.execCommand("BackColor", false, colour);
            }
            document.designMode = "off";
        } else if (document.selection && document.selection.createRange) {
            // IE case
            range = document.selection.createRange();
            range.execCommand("BackColor", false, colour);
        }
    }


$.fn.comments = function(options){
    return this.each(function(){
        $(this).mouseup(function(){
            $(this).selectText();
        });
    });       
}

$(function(){
    $('p').comments();
    $('input:checkbox').change(function(){
        if($(this).is(':checked')) {                  
               document.execCommand("BackColor", false, 'red');
        }
        else{    
            $('p').each(function(){                            

            });     
            
        }
    });
});