var Backbone = require('backbone');
var _ = require('underscore');

var SubbredditModel = require('../models/SubbredditModel.js');

var SubbredditsListView = Backbone.View.extend({
    el: '<ul></ul>',

    template: _.template(
        '<% subbreddits.each(function(subbreddit) { %>' +
            '<li><a data-id="<%= subbreddit.id %>" href="#"><%= subbreddit.get("name") %></a></li>' +
        '<% }); %>' +
        '<li>' +
            '<form>' +
                '<input type="text" name="name" />' +
                '<textarea name="description"></textarea>' +
                '<input type="submit" value="Add Subbreddit" />' +
            '</form>' +
        '</li>'
    ),

    events: {
        'click a': 'showPostsInSubbreddit',
        'submit form': 'addSubbreddit'
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

    addSubbreddit: function(e) {
        e.preventDefault();
        var subbreddit = new SubbredditModel({
            name: $(e.target).find('[name="name"]').val(),
            description: $(e.target).find('[name="description"]').val()
        });
        subbreddit.save();
        this.collection.add(subbreddit);
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