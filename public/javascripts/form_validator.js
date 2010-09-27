$.fn.formValidator = function(options){
    return this.each(function(){   
        var _form = $(this);  
        _form.submit(function(e){  
            _form.find('input').each(function(e){
                var _input = $(this);
                var value = _input.val();
                var error = false;
                if(value){                        
                    var type = this.getAttribute('type');                                     
                    var pattern = type == 'text' ? _input.attr('pattern') : type == 'email' ? /^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i : type == 'number' ? /^-?[0-9]*(\.[0-9]+)?$/ : type == 'url' ? /^(https?:\/\/)?[\da-z\.\-]+\.[a-z\.]{2,6}[#\?\/\w \.\-=]*$/i : false;
                    error = pattern && !pattern.test(value);                                                                         
                }
                else{
                   error = _input.attr('required');
                }                               
                error ? _input.addClass('error') : _input.hasClass('error') && _input.removeClass('error');
            }); 
           _form.find('.error').length && e.preventDefault();
        });
    });
}  

$(function(){         
    $('form').formValidator();
});