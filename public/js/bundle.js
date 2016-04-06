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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvYXBwLmpzIiwicHVibGljL2pzL2NvbGxlY3Rpb25zL1Bvc3RzQ29sbGVjdGlvbi5qcyIsInB1YmxpYy9qcy9jb2xsZWN0aW9ucy9TdWJicmVkZGl0c0NvbGxlY3Rpb24uanMiLCJwdWJsaWMvanMvbW9kZWxzL1Bvc3RNb2RlbC5qcyIsInB1YmxpYy9qcy9tb2RlbHMvU3ViYnJlZGRpdE1vZGVsLmpzIiwicHVibGljL2pzL3ZpZXdzL0hvbWVWaWV3LmpzIiwicHVibGljL2pzL3ZpZXdzL1Bvc3RzTGlzdFZpZXcuanMiLCJwdWJsaWMvanMvdmlld3MvU3ViYnJlZGRpdHNMaXN0Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIEhvbWVWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9Ib21lVmlldy5qcycpO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAkLmFqYXhTZXR1cCh7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdYLUNTUkYtVE9LRU4nOiAkKCdtZXRhW25hbWU9XCJjc3JmLXRva2VuXCJdJykuYXR0cignY29udGVudCcpXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBob21lVmlldyA9IG5ldyBIb21lVmlldygpO1xuICAgICQoJyNjb250ZW50JykuaHRtbChob21lVmlldy5yZW5kZXIoKS5lbCk7XG59KTtcblxuXG5cblxuXG5cblxuXG5cbiIsInZhciBQb3N0TW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvUG9zdE1vZGVsLmpzJyk7XG5cbnZhciBQb3N0c0NvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgdXJsOiAnL2FwaS9wb3N0cycsXG4gICAgbW9kZWw6IFBvc3RNb2RlbFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUG9zdHNDb2xsZWN0aW9uOyIsInZhciBTdWJicmVkZGl0TW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvU3ViYnJlZGRpdE1vZGVsLmpzJyk7XG5cbnZhciBTdWJicmVkZGl0c0NvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgdXJsOiAnL2FwaS9zdWJicmVkZGl0cycsXG4gICAgbW9kZWw6IFN1YmJyZWRkaXRNb2RlbFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ViYnJlZGRpdHNDb2xsZWN0aW9uOyIsInZhciBQb3N0TW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIHVybFJvb3Q6ICcvYXBpL3Bvc3RzJyxcbiAgICBpZEF0dHJpYnV0ZTogJ2lkJyxcblxuICAgIHBhcnNlOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5zdWJicmVkZGl0KSB7XG4gICAgICAgICAgICB2YXIgU3ViYnJlZGRpdE1vZGVsID0gcmVxdWlyZSgnLi9TdWJicmVkZGl0TW9kZWwuanMnKTtcbiAgICAgICAgICAgIHJlc3BvbnNlLnN1YmJyZWRkaXQgPSBuZXcgU3ViYnJlZGRpdE1vZGVsKHJlc3BvbnNlLnN1YmJyZWRkaXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb3N0TW9kZWw7IiwidmFyIFN1YmJyZWRkaXRNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgdXJsUm9vdDogJy9hcGkvc3ViYnJlZGRpdHMnLFxuICAgIGlkQXR0cmlidXRlOiAnaWQnLFxuXG4gICAgcGFyc2U6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLnBvc3RzKSB7XG4gICAgICAgICAgICB2YXIgUG9zdHNDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvUG9zdHNDb2xsZWN0aW9uLmpzJyk7XG4gICAgICAgICAgICByZXNwb25zZS5wb3N0cyA9IG5ldyBQb3N0c0NvbGxlY3Rpb24ocmVzcG9uc2UucG9zdHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdWJicmVkZGl0TW9kZWw7IiwidmFyIEhvbWVWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGVsOiAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPicgK1xuICAgICc8ZGl2IGNsYXNzPVwicm93XCI+JyArXG4gICAgJzxkaXYgY2xhc3M9XCJ0aHJlZSBjb2x1bW5zXCI+PC9kaXY+JyArXG4gICAgJzxkaXYgY2xhc3M9XCJzaXggY29sdW1uc1wiPicgK1xuICAgICc8ZGl2IGNsYXNzPVwicm93XCI+JyArXG4gICAgJzxkaXYgY2xhc3M9XCJ0d2VsdmUgY29sdW1uc1wiIGlkPVwicG9zdHNcIj48L2Rpdj4nICtcbiAgICAnPC9kaXY+JyArXG4gICAgJzxkaXYgY2xhc3M9XCJyb3dcIj4nICtcbiAgICAnPGRpdiBjbGFzcz1cInR3ZWx2ZSBjb2x1bW5zXCI+PC9kaXY+JyArXG4gICAgJzwvZGl2PicgK1xuICAgICc8L2Rpdj4nICtcbiAgICAnPGRpdiBjbGFzcz1cInRocmVlIGNvbHVtbnNcIiBpZD1cImFsbC1zdWJicmVkZGl0c1wiPjwvZGl2PicgK1xuICAgICc8L2Rpdj4nICtcbiAgICAnPC9kaXY+JyxcblxuICAgIGluc2VydFN1YmJyZWRkaXRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIFN1YmJyZWRkaXRzQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zL1N1YmJyZWRkaXRzQ29sbGVjdGlvbi5qcycpO1xuICAgICAgICB2YXIgc3ViYnJlZGRpdHMgPSBuZXcgU3ViYnJlZGRpdHNDb2xsZWN0aW9uKCk7XG4gICAgICAgIHN1YmJyZWRkaXRzLmZldGNoKCk7XG4gICAgICAgIHZhciBTdWJicmVkZGl0c0xpc3RWaWV3ID0gcmVxdWlyZSgnLi9TdWJicmVkZGl0c0xpc3RWaWV3LmpzJyk7XG4gICAgICAgIHZhciBzdWJicmVkZGl0c0xpc3RWaWV3ID0gbmV3IFN1YmJyZWRkaXRzTGlzdFZpZXcoe1xuICAgICAgICAgICAgY29sbGVjdGlvbjogc3ViYnJlZGRpdHNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNhbGwtc3ViYnJlZGRpdHMnKS5odG1sKHN1YmJyZWRkaXRzTGlzdFZpZXcucmVuZGVyKCkuZWwpO1xuICAgIH0sXG5cbiAgICBpbnNlcnRQb3N0czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBQb3N0c0NvbGxlY3Rpb24gPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9Qb3N0c0NvbGxlY3Rpb24uanMnKTtcbiAgICAgICAgdmFyIHBvc3RzID0gbmV3IFBvc3RzQ29sbGVjdGlvbigpO1xuICAgICAgICBwb3N0cy5mZXRjaCgpO1xuICAgICAgICB2YXIgUG9zdHNMaXN0VmlldyA9IHJlcXVpcmUoJy4vUG9zdHNMaXN0Vmlldy5qcycpO1xuICAgICAgICB2YXIgcG9zdHNMaXN0VmlldyA9IG5ldyBQb3N0c0xpc3RWaWV3KHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IHBvc3RzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjcG9zdHMnKS5odG1sKHBvc3RzTGlzdFZpZXcucmVuZGVyKCkuZWwpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmluc2VydFN1YmJyZWRkaXRzKCk7XG4gICAgICAgIHRoaXMuaW5zZXJ0UG9zdHMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZVZpZXc7IiwidmFyIFBvc3RzTGlzdFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgZWw6ICc8dWw+PC91bD4nLFxuXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICc8JSBwb3N0cy5lYWNoKGZ1bmN0aW9uKHBvc3QpIHsgJT4nICtcbiAgICAgICAgJzxsaT4nICtcbiAgICAgICAgJzxhIGhyZWY9XCIjXCI+PCU9IHBvc3QuZ2V0KFwidGl0bGVcIikgJT48L2E+JyArXG4gICAgICAgICc8JSBpZihwb3N0LmdldChcInN1YmJyZWRkaXRcIikpIHsgJT4nICtcbiAgICAgICAgJyA8c21hbGw+KDwlPSBwb3N0LmdldChcInN1YmJyZWRkaXRcIikuZ2V0KFwibmFtZVwiKSAlPik8L3NtYWxsPicgK1xuICAgICAgICAnPCUgfSAlPicgK1xuICAgICAgICAnPC9saT4nICtcbiAgICAgICAgJzwlIH0pOyAlPidcbiAgICApLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLCAndXBkYXRlJywgdGhpcy5yZW5kZXIpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoeyBwb3N0czogdGhpcy5jb2xsZWN0aW9uIH0pKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUG9zdHNMaXN0VmlldzsiLCJ2YXIgU3ViYnJlZGRpdHNMaXN0VmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICBlbDogJzx1bD48L3VsPicsXG5cbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzwlIHN1YmJyZWRkaXRzLmVhY2goZnVuY3Rpb24oc3ViYnJlZGRpdCkgeyAlPicgK1xuICAgICAgICAnPGxpPjxhIGRhdGEtaWQ9XCI8JT0gc3ViYnJlZGRpdC5pZCAlPlwiIGhyZWY9XCIjXCI+PCU9IHN1YmJyZWRkaXQuZ2V0KFwibmFtZVwiKSAlPjwvYT48L2xpPicgK1xuICAgICAgICAnPCUgfSk7ICU+J1xuICAgICksXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIGEnOiAnc29tZUZ1bmN0aW9uJ1xuICAgIH0sXG5cbiAgICBzb21lRnVuY3Rpb246IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgc3ViYnJlZGRpdElkID0gJChlLnRhcmdldCkuZGF0YSgnaWQnKTtcbiAgICAgICAgdmFyIFN1YmJyZWRkaXRNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9TdWJicmVkZGl0TW9kZWwuanMnKTtcbiAgICAgICAgdmFyIHN1YmJyZWRkaXQgPSBuZXcgU3ViYnJlZGRpdE1vZGVsKHsgaWQ6IHN1YmJyZWRkaXRJZCB9KTtcbiAgICAgICAgc3ViYnJlZGRpdC5mZXRjaCh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgUG9zdHNMaXN0VmlldyA9IHJlcXVpcmUoJy4vUG9zdHNMaXN0Vmlldy5qcycpO1xuICAgICAgICAgICAgICAgIHZhciBwb3N0c0xpc3RWaWV3ID0gbmV3IFBvc3RzTGlzdFZpZXcoeyBjb2xsZWN0aW9uOiBzdWJicmVkZGl0LmdldCgncG9zdHMnKSB9KTtcbiAgICAgICAgICAgICAgICAkKCcjcG9zdHMnKS5odG1sKHBvc3RzTGlzdFZpZXcucmVuZGVyKCkuZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICd1cGRhdGUnLCB0aGlzLnJlbmRlcik7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBsaXN0SXRlbXMgPSB0aGlzLnRlbXBsYXRlKHsgc3ViYnJlZGRpdHM6IHRoaXMuY29sbGVjdGlvbiB9KTtcbiAgICAgICAgdGhpcy4kZWwuaHRtbChsaXN0SXRlbXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdWJicmVkZGl0c0xpc3RWaWV3OyJdfQ==
