var Backbone = require('backbone');
var _ = require('underscore');

var SubbredditModel = require('../models/SubbredditModel.js');
var SubbredditModalView = require('./SubbredditModalView.js');

var SubbredditsListView = Backbone.View.extend({
    el: '<ul></ul>',

    template: _.template(
        '<li id="add-subbreddit"><a href="#" data-reveal-id="modal">Add New Subbreddit</a><li>' +
        '<% subbreddits.each(function(subbreddit) { %>' +
            '<li id="subbreddit"><a data-id="<%= subbreddit.id %>" href="#"><%= subbreddit.get("name") %></a></li>' +
        '<% }); %>'
    ),

    events: {
        'click #subbreddit': 'showPostsInSubbreddit',
        'click #add-subbreddit': 'showSubbredditModalView'
    },

    showPostsInSubbreddit: function(e) {
        e.preventDefault();
        var subbredditId = $(e.target).data('id');
        var subbreddit = new SubbredditModel({ id: subbredditId });
        subbreddit.fetch({
            success: function() {
                var PostsListView = require('./PostsListView.js');
                var postsListView = new PostsListView({ collection: subbreddit.get('posts') });
                $('#posts').html(postsListView.render().el);
            }
        });

    },

    showSubbredditModalView: function(e) {
        e.preventDefault();
        var subbredditModalView = new SubbredditModalView({
            collection: this.collection
        });
        $('#modal').html(subbredditModalView.el);
        subbredditModalView.render();
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