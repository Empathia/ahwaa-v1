$.fn.formValidator = function(options){
    return this.each(function(){   
        
        if(this.getAttribute('type')) {
            $(this).click(function(){  
                return validateForm($(this).closest('form'), options);
            });
        }
        else{
            var _form = $(this);
            _form.submit(function(){          
                return validateForm(_form, options);
            });            
        }
    });    
    
    function validateForm(_form, options){
         _form.find('input').each(function(e){
             var _input = $(this);
             var value = _input.val();
             var error = false;
             var type = this.getAttribute('type');

             if(value){    
                 var pattern = type == 'text' ? _input.attr('pattern') : type == 'email' ? /^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i : type == 'number' ? /^-?[0-9]*(\.[0-9]+)?$/ : type == 'url' ? /^(https?:\/\/)?[\da-z\.\-]+\.[a-z\.]{2,6}[#\?\/\w \.\-=]*$/i : false;
                 error = pattern && !pattern.test(value);
             }
             else{
                error = _input.attr('required');
             }
             error ? _input.addClass('error') && options.errors[type] && _input.next('.error').remove().end().after('<p class="error">' + options.errors[type] + '</p>') : _input.hasClass('error') && _input.removeClass('error') && _input.next('.error').remove();
         });
        if(_form.find('.error').length){
            return false;
        }
    }
}