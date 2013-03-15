$(function () {
    $('form').formValidator();
    $('#tagsTable').sortable({
      axis : 'y',
      update : function () {
        $.post($(this).data('update-url'), $(this).sortable('serialize'))
      }
    });
});
