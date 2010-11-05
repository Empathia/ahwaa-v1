$(function(){ 
    $('.usr-sec-title > a').add('.enter-profile > a').click(function(e){
           var link = $(this);
           link.closest('section').find('.user-edit span').css('display', 'none').end().find('input').css('display', 'block');
           var welcome = link.closest('.user-edit');
           welcome.length && welcome.fadeOut(function(){
             welcome.next().fadeIn();
             $('.edit-profile').click();  
           })
           e.preventDefault();
           return false;
     });               
     
     $('.cancel').click(function(){
           $(this).closest('.user-edit').find('input').css('display', 'none').end().find('span').css('display', 'block');
     });    
     
     $('.edit-profile').click(function(){
         var avatarsWrapper = $('.avatars-wrapper');
         avatarsWrapper.siblings('section').hide();
         avatarsWrapper.fadeIn();
         setTimeout(function(){   
             $('.loading').hide();
             var avatarsWrapper = $('<ul>').addClass('avatars suggested');
             var avatars = "";
             for(var i=0; i<16; i++){   
                 avatars += '<li ' + (i==3 ? 'class="active"' : '') + '><div class="thumb"><a href="#"><img src="/images/no-image.jpg" width="55"></a>' + (i==3 ? '<img src="/images/checkmark.png" class="checkmark"></div></li>' : '');
             }
             avatarsWrapper.append(avatars).appendTo('.avatars-wrapper');
             var avatarsOpacity = $('<ul>').addClass('avatars opacity');
             avatars = "";
             for(var i=0; i<16; i++){
                  avatars += '<li><div class="thumb"><a href="#"><img src="/images/no-image.jpg" width="55"></a></div></li>';  
             }
             avatarsOpacity.append(avatars).appendTo('.avatars-wrapper');
         },2000);
     }); 

});