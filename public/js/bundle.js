(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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

},{"./views/HomeView.js":6}],2:[function(require,module,exports){
var PostModel = require('../models/PostModel.js');

var PostsCollection = Backbone.Collection.extend({
    url: '/api/posts',
    model: PostModel
});

module.exports = PostsCollection;
},{"../models/PostModel.js":4}],3:[function(require,module,exports){
var SubbredditModel = require('../models/SubbredditModel.js');

var SubbredditsCollection = Backbone.Collection.extend({
    url: '/api/subbreddits',
    model: SubbredditModel
});

module.exports = SubbredditsCollection;
},{"../models/SubbredditModel.js":5}],4:[function(require,module,exports){
var PostModel = Backbone.Model.extend({
    urlRoot: '/api/posts',
    idAttribute: 'id',

    parse: function(response) {
        if(response.subbreddit) {
            var SubbredditModel = require('./SubbredditModel.js');
            response.subbreddit = new SubbredditModel(response.subbreddit);
        }
        return response;
    }
});

module.exports = PostModel;
},{"./SubbredditModel.js":5}],5:[function(require,module,exports){
var SubbredditModel = Backbone.Model.extend({
    urlRoot: '/api/subbreddits',
    idAttribute: 'id',

    parse: function(response) {
        if(response.posts) {
            var PostsCollection = require('../collections/PostsCollection.js');
            response.posts = new PostsCollection(response.posts);
        }
        return response;
    }
});

module.exports = SubbredditModel;
},{"../collections/PostsCollection.js":2}],6:[function(require,module,exports){
var HomeView = Backbone.View.extend({
    el: '<div class="container">' +
    '<div class="row">' +
    '<div class="three columns"></div>' +
    '<div class="six columns">' +
    '<div class="row">' +
    '<div class="twelve columns" id="posts"></div>' +
    '</div>' +
    '<div class="row">' +
    '<div class="twelve columns"></div>' +
    '</div>' +
    '</div>' +
    '<div class="three columns" id="all-subbreddits"></div>' +
    '</div>' +
    '</div>',

    insertSubbreddits: function() {
        var SubbredditsCollection = require('../collections/SubbredditsCollection.js');
        var subbreddits = new SubbredditsCollection();
        subbreddits.fetch();
        var SubbredditsListView = require('./SubbredditsListView.js');
        var subbredditsListView = new SubbredditsListView({
            collection: subbreddits
        });
        this.$el.find('#all-subbreddits').html(subbredditsListView.render().el);
    },

    insertPosts: function() {
        var PostsCollection = require('../collections/PostsCollection.js');
        var posts = new PostsCollection();
        posts.fetch();
        var PostsListView = require('./PostsListView.js');
        var postsListView = new PostsListView({
            collection: posts
        });
        this.$el.find('#posts').html(postsListView.render().el);
    },

    render: function() {
        this.insertSubbreddits();
        this.insertPosts();
        return this;
    }
});

module.exports = HomeView;
},{"../collections/PostsCollection.js":2,"../collections/SubbredditsCollection.js":3,"./PostsListView.js":7,"./SubbredditsListView.js":8}],7:[function(require,module,exports){
var PostsListView = Backbone.View.extend({
    el: '<ul></ul>',

    template: _.template(
        '<% posts.each(function(post) { %>' +
            '<li>' +
            '<a href="#"><%= post.get("title") %></a>' +
                '<% if(post.get("subbreddit")) { %>' +
                    ' <small>(<%= post.get("subbreddit").get("name") %>)</small>' +
                '<% } %>' +
            '</li>' +
        '<% }); %>'
    ),

    initialize: function() {
        this.listenTo(this.collection, 'update', this.render);
    },

    render: function() {
        this.$el.html(this.template({ posts: this.collection }));
        return this;
    }
});

module.exports = PostsListView;
},{}],8:[function(require,module,exports){
var SubbredditsListView = Backbone.View.extend({
    el: '<ul></ul>',

    template: _.template(
        '<% subbreddits.each(function(subbreddit) { %>' +
        '<li><a data-id="<%= subbreddit.id %>" href="#"><%= subbreddit.get("name") %></a></li>' +
        '<% }); %>'
    ),

    events: {
        'click a': 'someFunction'
    },

    someFunction: function(e) {
        e.preventDefault();
        var subbredditId = $(e.target).data('id');
        var SubbredditModel = require('../models/SubbredditModel.js');
        var subbreddit = new SubbredditModel({ id: subbredditId });
        subbreddit.fetch({
            success: function() {
                var PostsListView = require('./PostsListView.js');
                var postsListView = new PostsListView({ collection: subbreddit.get('posts') });
                $('#posts').html(postsListView.render().el);
            }
        });

    },

    initialize: function() {
        this.listenTo(this.collection, 'update', this.render);
    },

    render: function() {
        var listItems = this.template({ subbreddits: this.collection });
        this.$el.html(listItems);
        return this;
    }
});

module.exports = SubbredditsListView;
},{"../models/SubbredditModel.js":5,"./PostsListView.js":7}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc3JjL2pzL2FwcC5qcyIsInB1YmxpYy9zcmMvanMvY29sbGVjdGlvbnMvUG9zdHNDb2xsZWN0aW9uLmpzIiwicHVibGljL3NyYy9qcy9jb2xsZWN0aW9ucy9TdWJicmVkZGl0c0NvbGxlY3Rpb24uanMiLCJwdWJsaWMvc3JjL2pzL21vZGVscy9Qb3N0TW9kZWwuanMiLCJwdWJsaWMvc3JjL2pzL21vZGVscy9TdWJicmVkZGl0TW9kZWwuanMiLCJwdWJsaWMvc3JjL2pzL3ZpZXdzL0hvbWVWaWV3LmpzIiwicHVibGljL3NyYy9qcy92aWV3cy9Qb3N0c0xpc3RWaWV3LmpzIiwicHVibGljL3NyYy9qcy92aWV3cy9TdWJicmVkZGl0c0xpc3RWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBIb21lVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvSG9tZVZpZXcuanMnKTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgJC5hamF4U2V0dXAoe1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnWC1DU1JGLVRPS0VOJzogJCgnbWV0YVtuYW1lPVwiY3NyZi10b2tlblwiXScpLmF0dHIoJ2NvbnRlbnQnKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgaG9tZVZpZXcgPSBuZXcgSG9tZVZpZXcoKTtcbiAgICAkKCcjY29udGVudCcpLmh0bWwoaG9tZVZpZXcucmVuZGVyKCkuZWwpO1xufSk7XG4iLCJ2YXIgUG9zdE1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL1Bvc3RNb2RlbC5qcycpO1xuXG52YXIgUG9zdHNDb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIHVybDogJy9hcGkvcG9zdHMnLFxuICAgIG1vZGVsOiBQb3N0TW9kZWxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3RzQ29sbGVjdGlvbjsiLCJ2YXIgU3ViYnJlZGRpdE1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL1N1YmJyZWRkaXRNb2RlbC5qcycpO1xuXG52YXIgU3ViYnJlZGRpdHNDb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIHVybDogJy9hcGkvc3ViYnJlZGRpdHMnLFxuICAgIG1vZGVsOiBTdWJicmVkZGl0TW9kZWxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN1YmJyZWRkaXRzQ29sbGVjdGlvbjsiLCJ2YXIgUG9zdE1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICB1cmxSb290OiAnL2FwaS9wb3N0cycsXG4gICAgaWRBdHRyaWJ1dGU6ICdpZCcsXG5cbiAgICBwYXJzZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2Uuc3ViYnJlZGRpdCkge1xuICAgICAgICAgICAgdmFyIFN1YmJyZWRkaXRNb2RlbCA9IHJlcXVpcmUoJy4vU3ViYnJlZGRpdE1vZGVsLmpzJyk7XG4gICAgICAgICAgICByZXNwb25zZS5zdWJicmVkZGl0ID0gbmV3IFN1YmJyZWRkaXRNb2RlbChyZXNwb25zZS5zdWJicmVkZGl0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUG9zdE1vZGVsOyIsInZhciBTdWJicmVkZGl0TW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIHVybFJvb3Q6ICcvYXBpL3N1YmJyZWRkaXRzJyxcbiAgICBpZEF0dHJpYnV0ZTogJ2lkJyxcblxuICAgIHBhcnNlOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5wb3N0cykge1xuICAgICAgICAgICAgdmFyIFBvc3RzQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zL1Bvc3RzQ29sbGVjdGlvbi5qcycpO1xuICAgICAgICAgICAgcmVzcG9uc2UucG9zdHMgPSBuZXcgUG9zdHNDb2xsZWN0aW9uKHJlc3BvbnNlLnBvc3RzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ViYnJlZGRpdE1vZGVsOyIsInZhciBIb21lVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICBlbDogJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4nICtcbiAgICAnPGRpdiBjbGFzcz1cInJvd1wiPicgK1xuICAgICc8ZGl2IGNsYXNzPVwidGhyZWUgY29sdW1uc1wiPjwvZGl2PicgK1xuICAgICc8ZGl2IGNsYXNzPVwic2l4IGNvbHVtbnNcIj4nICtcbiAgICAnPGRpdiBjbGFzcz1cInJvd1wiPicgK1xuICAgICc8ZGl2IGNsYXNzPVwidHdlbHZlIGNvbHVtbnNcIiBpZD1cInBvc3RzXCI+PC9kaXY+JyArXG4gICAgJzwvZGl2PicgK1xuICAgICc8ZGl2IGNsYXNzPVwicm93XCI+JyArXG4gICAgJzxkaXYgY2xhc3M9XCJ0d2VsdmUgY29sdW1uc1wiPjwvZGl2PicgK1xuICAgICc8L2Rpdj4nICtcbiAgICAnPC9kaXY+JyArXG4gICAgJzxkaXYgY2xhc3M9XCJ0aHJlZSBjb2x1bW5zXCIgaWQ9XCJhbGwtc3ViYnJlZGRpdHNcIj48L2Rpdj4nICtcbiAgICAnPC9kaXY+JyArXG4gICAgJzwvZGl2PicsXG5cbiAgICBpbnNlcnRTdWJicmVkZGl0czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBTdWJicmVkZGl0c0NvbGxlY3Rpb24gPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9TdWJicmVkZGl0c0NvbGxlY3Rpb24uanMnKTtcbiAgICAgICAgdmFyIHN1YmJyZWRkaXRzID0gbmV3IFN1YmJyZWRkaXRzQ29sbGVjdGlvbigpO1xuICAgICAgICBzdWJicmVkZGl0cy5mZXRjaCgpO1xuICAgICAgICB2YXIgU3ViYnJlZGRpdHNMaXN0VmlldyA9IHJlcXVpcmUoJy4vU3ViYnJlZGRpdHNMaXN0Vmlldy5qcycpO1xuICAgICAgICB2YXIgc3ViYnJlZGRpdHNMaXN0VmlldyA9IG5ldyBTdWJicmVkZGl0c0xpc3RWaWV3KHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IHN1YmJyZWRkaXRzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjYWxsLXN1YmJyZWRkaXRzJykuaHRtbChzdWJicmVkZGl0c0xpc3RWaWV3LnJlbmRlcigpLmVsKTtcbiAgICB9LFxuXG4gICAgaW5zZXJ0UG9zdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgUG9zdHNDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvUG9zdHNDb2xsZWN0aW9uLmpzJyk7XG4gICAgICAgIHZhciBwb3N0cyA9IG5ldyBQb3N0c0NvbGxlY3Rpb24oKTtcbiAgICAgICAgcG9zdHMuZmV0Y2goKTtcbiAgICAgICAgdmFyIFBvc3RzTGlzdFZpZXcgPSByZXF1aXJlKCcuL1Bvc3RzTGlzdFZpZXcuanMnKTtcbiAgICAgICAgdmFyIHBvc3RzTGlzdFZpZXcgPSBuZXcgUG9zdHNMaXN0Vmlldyh7XG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBwb3N0c1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI3Bvc3RzJykuaHRtbChwb3N0c0xpc3RWaWV3LnJlbmRlcigpLmVsKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pbnNlcnRTdWJicmVkZGl0cygpO1xuICAgICAgICB0aGlzLmluc2VydFBvc3RzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWVWaWV3OyIsInZhciBQb3N0c0xpc3RWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGVsOiAnPHVsPjwvdWw+JyxcblxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPCUgcG9zdHMuZWFjaChmdW5jdGlvbihwb3N0KSB7ICU+JyArXG4gICAgICAgICAgICAnPGxpPicgK1xuICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCI+PCU9IHBvc3QuZ2V0KFwidGl0bGVcIikgJT48L2E+JyArXG4gICAgICAgICAgICAgICAgJzwlIGlmKHBvc3QuZ2V0KFwic3ViYnJlZGRpdFwiKSkgeyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAnIDxzbWFsbD4oPCU9IHBvc3QuZ2V0KFwic3ViYnJlZGRpdFwiKS5nZXQoXCJuYW1lXCIpICU+KTwvc21hbGw+JyArXG4gICAgICAgICAgICAgICAgJzwlIH0gJT4nICtcbiAgICAgICAgICAgICc8L2xpPicgK1xuICAgICAgICAnPCUgfSk7ICU+J1xuICAgICksXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICd1cGRhdGUnLCB0aGlzLnJlbmRlcik7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh7IHBvc3RzOiB0aGlzLmNvbGxlY3Rpb24gfSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb3N0c0xpc3RWaWV3OyIsInZhciBTdWJicmVkZGl0c0xpc3RWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGVsOiAnPHVsPjwvdWw+JyxcblxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPCUgc3ViYnJlZGRpdHMuZWFjaChmdW5jdGlvbihzdWJicmVkZGl0KSB7ICU+JyArXG4gICAgICAgICc8bGk+PGEgZGF0YS1pZD1cIjwlPSBzdWJicmVkZGl0LmlkICU+XCIgaHJlZj1cIiNcIj48JT0gc3ViYnJlZGRpdC5nZXQoXCJuYW1lXCIpICU+PC9hPjwvbGk+JyArXG4gICAgICAgICc8JSB9KTsgJT4nXG4gICAgKSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgYSc6ICdzb21lRnVuY3Rpb24nXG4gICAgfSxcblxuICAgIHNvbWVGdW5jdGlvbjogZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBzdWJicmVkZGl0SWQgPSAkKGUudGFyZ2V0KS5kYXRhKCdpZCcpO1xuICAgICAgICB2YXIgU3ViYnJlZGRpdE1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL1N1YmJyZWRkaXRNb2RlbC5qcycpO1xuICAgICAgICB2YXIgc3ViYnJlZGRpdCA9IG5ldyBTdWJicmVkZGl0TW9kZWwoeyBpZDogc3ViYnJlZGRpdElkIH0pO1xuICAgICAgICBzdWJicmVkZGl0LmZldGNoKHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBQb3N0c0xpc3RWaWV3ID0gcmVxdWlyZSgnLi9Qb3N0c0xpc3RWaWV3LmpzJyk7XG4gICAgICAgICAgICAgICAgdmFyIHBvc3RzTGlzdFZpZXcgPSBuZXcgUG9zdHNMaXN0Vmlldyh7IGNvbGxlY3Rpb246IHN1YmJyZWRkaXQuZ2V0KCdwb3N0cycpIH0pO1xuICAgICAgICAgICAgICAgICQoJyNwb3N0cycpLmh0bWwocG9zdHNMaXN0Vmlldy5yZW5kZXIoKS5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ3VwZGF0ZScsIHRoaXMucmVuZGVyKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGxpc3RJdGVtcyA9IHRoaXMudGVtcGxhdGUoeyBzdWJicmVkZGl0czogdGhpcy5jb2xsZWN0aW9uIH0pO1xuICAgICAgICB0aGlzLiRlbC5odG1sKGxpc3RJdGVtcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN1YmJyZWRkaXRzTGlzdFZpZXc7Il19
