'use strict';

var $ = window.$ = window.jQuery = require('jquery');
require('foundation-sites');
var HomeView = require('./views/HomeView.js');

$(document).ready(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var homeView = new HomeView();
    $('#content').html(homeView.render().el);
});
