$.fn.formValidator = function(options){

    function validateForm(_form, options){
         var errors = _form.find('.error');
         errors.filter('p').remove();
         errors.removeClass('error');
         _form.find('input, textarea').each(function(e){
             var _input = $(this),
                 value = _input.val(),
                 error = false,
                 type = this.getAttribute('type');
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
                 error = pattern && !pattern.test(value);
             }
             else{
                error = _input.attr('required');
             }   
             if(error){
                 _input.addClass('error')
                 if(options.errors[type]){
                     var parentField = _input.closest('.field'),
                         error = '<p class="error">' + options.errors[type] + '</p>';
                     parentField.length ? parentField.after(error) : _input.after(error);
                 }
             }
         });
        if(_form.find('.error').length){
            return false;
        }
    }

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
};
