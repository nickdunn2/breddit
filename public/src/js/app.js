'use strict';

var $ = window.$ = window.jQuery = require('jquery');
require('foundation');
var HomeView = require('./views/HomeView.js');

$(document).ready(function() {
	$(document).foundation();

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var homeView = new HomeView();
    $('#content').html(homeView.el);
    homeView.render();
});
