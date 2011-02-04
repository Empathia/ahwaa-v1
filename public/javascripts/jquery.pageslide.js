$.fn.pageSlide = function(opts) { 
  var settings = $.extend({
    height: '85%',
    loading: false,
    buttons : {
      back : {
        display: true,
        label: "Back to site"
      },
      copy_url : {
        display: true,
        label: "Copy URL",
        success: "Copied to clipboard!"
      },
      view_original : {
        display: true,
        label: "View Original"
      },
      bookmarkers : {
        fb_share : {
          display: true,
          label: "Share"
        },
        display: true 
      },
      prev : {
        display: true,
        label: "PREV"
      },
      next : {
        display: true,
        label: "NEXT"
      }
    },     
    duration: 'normal',
    direction: 'top',
    modal: false
  }, opts);

  var page = $(document),
      body = $('body'),
      htmlDom = $('html'),
      collection = $(this),
      size = collection.size(),                          
      current = false;
            
  function _initialize(anchor) {
    if($('#pageslide-body-wrap').length != 0){
      var psSlideContent = $('#pageslide-content');
      psSlideContent.children('iframe').length == 0 && !new RegExp(location.host, 'gi').test(collection.eq(0).attr('href')) && $('<iframe />').attr('id', 'pageslide-iframe').appendTo(psSlideContent);
      return;
    }
    
    var psBodyWrap = $('<div />').attr('id', 'pageslide-body-wrap');
    body.children(':not(script)').wrapAll(psBodyWrap);
    
        
    var psSlideContent = $('<div/>').attr('id', 'pageslide-content');
    psSlideContent.append(_addButtonsBar());  
                                                                                   

    !new RegExp(location.host, 'gi').test(collection.eq(0).attr('href')) && $('<iframe />').attr('id', 'pageslide-iframe').appendTo(psSlideContent);

    $('<div />').attr('id', 'pageslide-slide-wrap').append(psSlideContent).appendTo(body);
    
    $('<div />').attr("id", "pageslide-blanket").appendTo(body).click(function(){
      return false;
    });
    
    $(window).resize(function() {
    $('#pageslide-body-wrap').width(body.width());
    });

    $(anchor).attr('rel', 'pageslide'); 
    
    _bindButtons();
  }
  
  function _addButtonsBar(){
    var psSlideBack = $('<div />').attr('id', 'pageslide-close-bar').attr('href', '#');
    settings.buttons.back.display && $('<a />').addClass('pageslide-close').text(settings.buttons.back.label).attr('href', '#').appendTo(psSlideBack);
    settings.buttons.copy_url.display && $('<a />').attr('id', 'glueButton').text(settings.buttons.copy_url.label).appendTo(psSlideBack);
    settings.buttons.view_original.display && $('<a />').attr('href', '#').addClass('view-original').text(settings.buttons.view_original.label).appendTo(psSlideBack);            
    settings.buttons.prev.display && size > 1 && $('<div>').addClass('slide-controls').html('<div><a href="#" class="prev">PREV</a><a href="" class="next">NEXT</a></div>').appendTo(psSlideBack) && $('<div />').addClass('psMessage').appendTo(psSlideBack);
    if(settings.buttons.bookmarkers.display){
      var bookmarkers = $('<div />').addClass('bookmarkers');
      settings.buttons.bookmarkers.fb_share.display && bookmarkers.append('<a href="javascript:void(0)" title="Share to Facebook" class="share-facebook"></a>');
      bookmarkers.appendTo(psSlideBack);
    }
    return psSlideBack;
  } 
  
  function _bindButtons() {    
    var psIframe = $('#pageslide-iframe');
    $('.view-original').unbind('click').click(function(){
      window.location = psIframe.attr('src')
    });

    $('.pageslide-close').unbind('click').click(function(ev) {
      collection.trigger('closePageSlide');
      return false;
    });

    settings.buttons.prev.display && $('.slide-controls a').unbind('click').click(function(){
      current = $(this).hasClass('next') ? ((current == size-1) ? 0 : current+1) : ((current == 0) ? size-1 : current-1);
      var url = collection.eq(current).attr('href');
      psIframe.attr('src', url);
      settings.buttons.bookmarkers.display && _changeFacebookURL(url);
      return false;
    });
  };
  
  function _changeFacebookURL(url){
    $('.share-facebook').unbind('click').click(function(){
      window.open("http://www.facebook.com/sharer.php?u="+encodeURIComponent(url), 'sharer', 'toolbar=0,status=0,width=626,height=436');
      return false;
    }).attr('href', "http://www.facebook.com/sharer.php?u="+encodeURIComponent(url));
  }
  
  function _overflowFixAdd() {
    $.browser.msie ? body.add(htmlDom).css({overflowX: 'hidden'}) : body.css({overflowX: 'hidden'});
  }
  
  function _overflowFixRemove() {
    $.browser.msie ? body.add(htmlDom).css({overflowX: ''}) : body.css({overflowX: ''});
  }
  
  function _showBlanket() {                   
    $("#pageslide-blanket").css('height', page.height()).toggle().animate({opacity: '0.25'}, 'fast', 'linear');
  }
  
  function _hideBlanket() {
    $("#pageslide-blanket").is(":visible") && $("#pageslide-blanket").animate({opacity: '0.0'}, 'fast', 'linear', function () {
      $(this).hide();
    });
  }
  
  function _openSlide(elm) {           
    var psWrap = $('#pageslide-slide-wrap'),
        psBodyWrap = $('#pageslide-body-wrap'),
        psIframe = $('#pageslide-iframe'),
        psContent = $('#pageslide-content'),
        direction = {};
    _showBlanket();
    !new RegExp(location.host, 'gi').test(elm.href) ? psContent.children().not('iframe').not('#pageslide-close-bar').hide() : psContent.children().hide();
    if(/top|bottom/.test(settings.direction)) {
      psWrap.css({height: 0, width: '100%'});
      psContent.children('iframe, #pageslide-close-bar').show();
      var new_height = settings.height.charAt(settings.height.length - 1) == '%' ? Math.ceil($(window).height() * parseFloat(settings.height) / 100) + 'px' : settings.height;
      if(/bottom/.test(settings.direction)){
        direction = {
          bottom: '-' + new_height
        };
        psWrap.css('top', 'auto');
      }
      else{
        direction = {
          top: new_height
        };
        psWrap.css('bottom', 'auto');        
      }   
      body.attr('scrollTop', 0);
      body.add(htmlDom).css({overflowY: 'hidden'});
      psBodyWrap.find('header:eq(0)').css('position', 'relative');
      psWrap.animate({height: new_height}, settings.duration);
      psBodyWrap.animate(direction, settings.duration, function() {        
        psContent.css('height', psWrap.height() - 40).show();
        if(!new RegExp(location.host, 'gi').test(elm.href)){
          settings.loading && psIframe.css('height', 0);
          $(elm).attr('href') !== psIframe.attr('src') && psIframe.attr('src', elm.href) && settings.buttons.bookmarkers.display && _changeFacebookURL(elm.href);
          settings.buttons.copy_url.display && loadZeroClipboard('glueButton', function(){
          var psMessage = $('.psMessage');
          psMessage.html(settings.buttons.copy_url.success);
          setTimeout(function(){
            psMessage.html('&nbsp;');
          }, 5000);
          }) && setZeroClipboardText(psIframe.attr('src'));
        }

        $(window).resize(function() {
          new_height = settings.height.charAt(settings.height.length - 1) == '%' ? Math.ceil($(window).height() * parseFloat(settings.height) / 100) + 'px' : settings.height;
          psWrap.css('height', new_height);
          psContent.css('height', psWrap.height() - 40);
          psBodyWrap.css('top', new_height);
        });
      });
    }
    else {  
      psWrap.css({width:0, height:'100%'});   
      psContent.css('height', '').show();
      if (settings.direction == "right") {  
        direction = {
            right: "-" + settings.width
        };
        psWrap.css('left', 0);
        _overflowFixAdd();
      }
      else {
        direction = {
            left: "-" + settings.width
        };       
        psWrap.css('right', 0);
      }                   
      psWrap.animate({width: settings.width}, settings.duration);
      ($.browser.webkit || $.browser.msie) && $('header').animate(direction);
      psBodyWrap.css('overflow', 'hidden').animate(direction, settings.duration, function () {
          $.ajax({
              type: "GET",
              url: $(elm).attr("href"),
              success: function (data) {
                psContent.css("width", settings.width).children(':not(iframe)').not('#pageslide-close-bar').remove();
                psContent.append(data).queue(function () {
                      $(this).dequeue();

                      // add hook for a close button
                      $('.request-topic-section').find('.pageslide-close').unbind('click').click(function (elm) {
                          collection.trigger('closePageSlide');
                      });
                      $('.new_topic_request').find('input[type=submit]').formValidator(
                          {
                              'errors': {
                                  'text': I18n.t('layouts.application.header.request_topic.title'),
                                  'textarea': I18n.t('layouts.application.header.request_topic.topic_details')
                              }
                          }
                      );
                  });
              }
          });
      });
    }
  };
  
  collection.bind('closePageSlide', function(event){
      var psWrap = $('#pageslide-slide-wrap'),
          psBodyWrap = $('#pageslide-body-wrap'),
          header = psBodyWrap.find('header:eq(0)'); 
          
      if(event.button != 2){  
        _hideBlanket();
        if(/top|bottom/.test(settings.direction) && psWrap.height() != 0){
          body.css('height', 'auto');
          psWrap.animate({height: 0}, settings.duration, function() {
            $('#pageslide-content').css('height', '0px').hide();
            psWrap.add(psBodyWrap).css({
              top: 0,
              bottom: '',
              width: ''
            });                   
            header.css('position', '');
            $(window).unbind('resize');
            $('#pageslide-iframe').attr('src', 'about:blank');
            body.add(htmlDom).css({overflowY: ''});
          });
        }
        else if(psWrap.width() != 0){
          var direction = (psWrap.css("left") != "0px") ? {left: "0"} : {right: "0"};
          psBodyWrap.animate(direction, settings.duration);
          psWrap.animate({width: '0'}, settings.duration, function (){
            
              $("#pageslide-content").css("width", '');
              psWrap.add(psBodyWrap).css({
                left: '',
                right: '',
                width: '',
                height: ''
              }); 
              
              psBodyWrap.css('overflow', '');
              _overflowFixRemove();
          });
          ($.browser.webkit || $.browser.msie) && header.animate(direction);
        }
      }
  });  
  

  _initialize(this);

  page.click(function(ev) {
    if(ev.target.tagName != "A") {
      collection.trigger('closePageSlide');
      return false;
    }
  });
  
  return this.each(function() {
    var link = $(this);
    if(!link.hasClass('pageslide-binded')) {
      link.bind('click', function(e) {
        _openSlide(this);
        link.addClass('pageslide-binded');
        return false;
      });
    }
  });
};

$(function() {
  $(document).keyup(function(event) {                                     
    $("#pageslide-blanket").is(":visible") && event.keyCode == 27 && $('a').trigger('closePageSlide');
  });
});