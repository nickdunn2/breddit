var Backbone = require('backbone');
var _ = require('underscore');

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