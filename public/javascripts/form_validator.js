$.fn.formValidator = function(options){

    function validateForm(_form, options){
         var errors = _form.find('.error');
         errors.filter('p').remove();
         errors.removeClass('error');
         _form.find('input, textarea').each(function(e){
             var _input = $(this),
                 value = _input.val(),
                 error = false,  
                 error_msg = '',
                 type = this.getAttribute('type');              
             value == _input.attr('placeholder') && (value = '');
             if(value){         
                 var pattern = false;
                 switch(type){
                     case 'text':
                        pattern = _input.attr('pattern');
                        break;
                     case 'email':
                        pattern = /^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i;
                        break;
                     case 'number':
                        pattern = /^-?[0-9]*(\.[0-9]+)?$/;
                        break;
                     case 'url':
                        pattern = /^(https?:\/\/)?[\da-z\.\-]+\.[a-z\.]{2,6}[#\?\/\w \.\-=]*$/i;
                        break;
                     case 'password':
                        pattern =  /^\S{6,}/i;
                        break;
                 }
                 error = (pattern && !pattern.test(value)) ? 'invalid' : '';
             }
             else{
                error = _input.attr('required') ? 'empty' : '';
             }   
             if(error){
                 _input.addClass('error');
                 error_msg = typeof options.errors[type] == 'object' ? options.errors[type][error] : options.errors[type];
                 if(error_msg){
                     var parentField = _input.closest('.field'),
                         error = '<p class="error">' + error_msg + '</p>';
                     parentField.length ? parentField.after(error) : _input.after(error);
                 }
             }
         });
        if(_form.find('.error').length){
            return false;
        }
        return true;
    }

    return this.each(function(){

        if(this.getAttribute('type')) {
            $(this).click(function(){
                if(validateForm($(this).closest('form'), options)) {
                    $(this).parents('form').trigger('submit');
                }
                return false;
            });
        }
        else{
            var _form = $(this);
            _form.bind('submit', function(){
                return validateForm(_form, options);
            });
        }
    });
};
