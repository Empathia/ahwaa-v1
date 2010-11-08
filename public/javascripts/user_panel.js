$(function(){ 
    $('.edit-lk').add('.enter-profile > a').click(function(e){        
           var link = $(this);
           if(link.hasClass('active')){
               return false;
           }
           var form = link.closest('form');
           form.find('.user-edit span').css('display', 'none').end().find('input').css('display', 'block');
           var welcome = form.find('.welcome-wrapper');           
           if(welcome.length && welcome.is(':visible')){

                 welcome.fadeOut(function(){               
                     welcome.next().fadeIn();
                     (!welcome.find('a').hasClass('active')) && avatars.toggle();
                     link.addClass('active');
                 });  
           }
           else{          
             link.addClass('active');
           }
           e.preventDefault(); 
           return false;
     });
     
     $('.cancel').click(function(){
           var form = $(this).closest('form');
           form.find('.edit-lk').removeClass('active');
           var welcome = form.find('.welcome-wrapper');
           welcome.length && welcome.next().fadeOut(function(){
               welcome.find('.enter-profile').children().removeClass('active');
               welcome.fadeIn();
           });
           form.find('input').css('display', 'none').end().find('span').css('display', 'block');
     });    
     
     $('.edit-profile').click(function(){
       // avatars.toggle(); 
     }); 
     
     var avatars = {
         toggle: function(){
             $(this).hasClass('active') ? avatars.hide() : avatars.show();
         },        
         hide: function(){
            $('.avatars-wrapper').hide();
         },
         show: function(){ 
           var avatarsMarkup = $('.avatars');
           avatarsMarkup.length ? avatarsMarkup.show() : avatars.create();
         },
         create: function(){                   
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
              return false; 
        }
    }
});