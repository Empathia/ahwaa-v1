$(function () {
    $('.filter-stream > select').bind('change', function () {
        $(this).closest('form').submit();
    });
    $("select, .include-message:checkbox").uniform();
});
