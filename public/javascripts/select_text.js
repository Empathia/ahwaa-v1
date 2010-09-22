$.fn.selectText = function(color){ 
    var range, sel;
    if (window.getSelection) { // Non-IE case
        sel = window.getSelection();
    if (sel.getRangeAt) {
        range = sel.getRangeAt(0);
    }
    document.designMode = "on";
    if (range) {
        sel.removeAllRanges();
        sel.addRange(range);
    }
    
    if ( !document.execCommand("HiliteColor", false, color) ) { // Use HiliteColor since some browsers apply BackColor to the whole block
        document.execCommand("BackColor", false, color);
    }
    document.designMode = "off";
    } else if (document.selection && document.selection.createRange) { // IE case
        range = document.selection.createRange();
        range.execCommand("BackColor", false, color);
    }
} 

$.fn.comments = function(options){
    var _parags = $(this);
    $('input:checkbox').change(function(){
        $(this).is(':checked') ? _parags.find('span').css('backgroundColor', options.color) : _parags.find('span').css('backgroundColor', 'transparent');
    });
    
    return this.each(function(){
        $(this).mouseup(function(){
            $(this).selectText(options.color);
        });
    });       
}

$(function(){
    $('p').comments({color: '#FFFF00'});
});