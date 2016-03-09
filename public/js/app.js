'use strict';

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var SubbredditModel = Backbone.Model.extend({
    urlRoot: '/api/subbreddits',
    idAttribute: 'id'
});

var PostModel = Backbone.Model.extend({
    urlRoot: '/api/posts',
    idAttribute: 'id'
});

var CommentModel = Backbone.Model.extend({
    urlRoot: '/api/comments',
    idAttribute: 'id'
});

var SubbredditsCollection = Backbone.Collection.extend({
    url: '/api/subbreddits',
    model: SubbredditModel
});

var PostsCollection = Backbone.Collection.extend({
    url: '/api/posts',
    model: PostModel
});

var CommentsCollection = Backbone.Collection.extend({
    url: '/api/comments',
    model: CommentModel
});

var PostItemView = Backbone.View.extend({
    el: '<li></li>',

    template: _.template('<h2><%= post.get("title") %></h2>'),

    initialize: function() {
        this.listenTo(this.model, 'all', function(event) {
            console.log(event);
        });
        this.listenTo(this.model, 'sync', this.render);
    },

    events: {
        "click h2": function(e) {
            this.model.destroy({
                wait: true
            });
        }
    },

    render: function() {
        this.$el.html(this.template({post: this.model}));
        return this;
    }
});

var PostsListView = Backbone.View.extend({
    el: '<ul></ul>',

    template: undefined,

    initialize: function() {
        this.listenTo(this.collection, 'all', function(event) {
            console.log(event);
        });
        this.listenTo(this.collection, 'sync update', this.render);
    },

    render: function() {
        var that = this;
        this.$el.html('');
        this.collection.each(function(postModel) {
            var postItemView = new PostItemView({ model: postModel });
            postItemView.render();
            that.$el.append(postItemView.el);
        });
        return this;
    }
});

var posts = new PostsCollection();
posts.fetch({
    success: function() {
        var postsListView = new PostsListView({ collection: posts });
        postsListView.render();
        $('#content').html(postsListView.el);
    }
});






