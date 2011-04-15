function getProfileTopicMatches () {
    $.ajax({
        url: '/admin/topics/' + currentTopicId + '/profile_matches/list_matches.js',
        data: $('#profile_match_filters_form').serialize(),
        dataType: 'script',
        type: 'POST'
    });
}

$(function () {
    // Listen to the profile match fomr select tags to filter results dinamically
    $('#profile_match_filters_form').find('select').change(getProfileTopicMatches);
});

