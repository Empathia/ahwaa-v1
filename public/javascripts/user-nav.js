$(function(){
    $('.panel-sub-nav .sub-nav > li').last().addClass("last-child");
    $('.panel-sub-nav .sub-nav > li.active').prev().css("border-bottom", "0 none");
    $('.panel-sub-nav .sub-nav > li.active').next().css("border-top", "0 none");
});