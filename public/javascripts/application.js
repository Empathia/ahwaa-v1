// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$.fn.selectText = function(){
    var _parag = $(this);
    //_parag.html(_parag.text());
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
        range = selection.createRange();
	} 
	//console.log(String(range.endContainer));
    console.log(selection.getRangeAt(0).endContainer);
    console.log(selection.getRangeAt(0).endOffset)
    //xw`x`xconsole.log(selection.getRangeAt(1));
 	var ranges = _parag.data('ranges') || new Array();    
 	var rangesSize = ranges.length;

 	if(rangesSize){              
        for(var i=0; i<rangesSize; i++){       
            //isPointInRange                                                                          
                 //console.log('seleccionado->' + range.startOffset);
                 //console.log('guardado->' + ranges[i].startOffset);
               //console.log(range.startOffset >= ranges[i].startOffset);               
               //console.log(range.startOffset < ranges[i].endOffset);
            if(range.startOffset >= ranges[i].startOffset && range.startOffset < ranges[i].endOffset){
                if(range.endOffset > ranges[i].endOffset){                                       
                    console.log('Would you like to extend the highlighted text?');
                    //if yes             
                    //ranges[i].setEnd(range.endContainer, range.endOffset);
                    ranges[i].endOffset = range.endOffset; 
                    range.setStart(range.startContainer, ranges[i].startOffset);
                    ranges[i].text = range.cloneContents();
                }                                                                 
                else{
                    console.log('The selected text is part of a highlighted text, would you like change the current highlighted text?');
                    //If yes          
                                                        
                    //ranges[i].setStart(range.startContainer, range.startOffset);
                    //ranges[i].setEnd(range.endContainer, range.endOffset);
                    ranges[i].endOffset = range.endOffset;
                    ranges[i].startOffset = range.startOffset;
                }
                break;
            }                                                                             
            else if(range.endOffset >= ranges[i].startOffset && range.endOffset < ranges[i].endOffset){
                console.log('Would you like to extend the highlighted text?');
                break;
            }
            else{          
               ranges.push({startOffset: range.startOffset, endOffset: range.endOffset, text: range.toString()}); 
            }
        }

 	}
 	else{  
 	    ranges.push({startOffset: range.startOffset, endOffset: range.endOffset, text: range.toString()});
        _parag.data('ranges', ranges);
 	}    
 	addHightlight();
 	//console.log(ranges[ranges.length-1].text);

    
   function addHightlight(){  
       _parag.html(_parag.text());
       for(var i in ranges){
             var substring = _parag.text().substring(ranges[i].startOffset, ranges[i].endOffset - ranges[i].startOffset);
             _parag.html(_parag.html().replace(ranges[i].text, "<span style='background-color: yellow'>" + ranges[i].text + "</span>"));
             //console.log(_parag.text().substring(ranges[i].startOffset, 10));
             //console.log('tu');
             //_parag.text().substring(ranges[i].startOffset, 10).replace('hola');
             //       var spans = _parag.children('span');
             //spans.eq(i).replaceWith(ranges[i].text);
             //var span = document.createElement("span");
             //span.style.backgroundColor = "yellow";              
             //span.appendChild(range.extractContents());    
             //range.insertNode(span);       
        }
   }
    /*
    var selectionContents = range.extractContents(); //cloneContents()
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
    $('p').comments();
    $('input:checkbox').change(function(){
        if($(this).is(':checked')) {                
            $('p').each(function(){
                var ranges = $(this).data('ranges');
                for (var i in ranges ){                                   
                    var span = document.createElement("span");
                    span.style.color = "yellow";              
                    span.appendChild(ranges[i].text);
                    //ranges[i].insertNode(span);
                    //console.log(ranges[0].toString() + '222');
                }
            });
        }
        else{    
            $('p').each(function(){                            
              //var ranges = $('p:first').data('ranges');      
              //var parag = $(this);  
              //console.log(ranges[0])       
              //var texto =  ranges[0].toString();             
              //console.log(parag.contents());
              //parag.contents().replaceWith(parag.text());
              //parag.contents(parag.text());              
            });     
            
        }
    });
});