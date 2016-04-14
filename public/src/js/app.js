'use strict';

var $ = window.$ = window.jQuery = require('jquery');
var Backbone = require('backbone');
require('foundation');

var HomeView = require('./views/HomeView.js');
var TopNavView = require('./views/TopNavView.js');

$(document).ready(function() {
	$(document).foundation();

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var topNavView = new TopNavView();
    $('#nav').html(topNavView.el);
    topNavView.render();

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home'
        },

        home: function() {
            var homeView = new HomeView();
            $('#content').html(homeView.el);
            homeView.render();
        }
    });

    new AppRouter();
    Backbone.history.start();

});
