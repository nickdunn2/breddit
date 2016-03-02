'use strict';

$.ajax('/subbreddits', {
    type: 'GET',
    success: function(subbreddits) {
        var string = "";
        for(var i = 0; i < subbreddits.data.length; i++) {
            string += subbreddits['data'][i]['name'] + '<br />';
        }

        //$.each(subbreddits, function(idx, subbreddit) {
        //    string += subbreddit.name;
        //    string += ' ';
        //});
        $('#content').html(string);
    }
});