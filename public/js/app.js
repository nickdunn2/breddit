'use strict';

$.ajax('/subbreddits', {
    type: 'GET',
    success: function(subbreddits) {
        var string = "";
        $.each(subbreddits, function(idx, subbreddit) {
            string += subbreddit.name;
            string += ' ';
        });
        $('#content').text(string);
    }
});