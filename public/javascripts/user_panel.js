$(function(){ 
    $('.usr-sec-title > a').click(function(e){
           $(this).closest('section').find('.user-edit span').css('display', 'none').end().find('input').css('display', 'block');
           e.preventDefault();
           return false;
     });               
     
     $('.cancel').click(function(){
           $(this).closest('.user-edit').find('input').css('display', 'none').end().find('span').css('display', 'block');
     });
});