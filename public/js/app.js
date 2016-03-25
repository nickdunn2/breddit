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

var HomeView = Backbone.View.extend({
    el: '<div class="container">' +
            '<div class="row">' +
                '<div class="three columns"></div>' +
                '<div class="six columns">' +
                    '<div class="row">' +
                        '<div class="twelve columns"></div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="twelve columns"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="three columns" id="all-subbreddits"></div>' +
            '</div>' +
        '</div>',

    render: function() {
        var subbreddits = new SubbredditsCollection();
        subbreddits.fetch();
        var subbredditsListView = new SubbredditsListView({
            collection: subbreddits
        });
        this.$el.find('#all-subbreddits').html(subbredditsListView.render().el);

        return this;
    }
});

var SubbredditsListView = Backbone.View.extend({
    el: '<ul></ul>',

    template: _.template(
        '<% subbreddits.each(function(subbreddit) { %>' +
            '<li><a href="#"><%= subbreddit.get("name") %></a></li>' +
        '<% }); %>'
    ),

    initialize: function() {
        this.listenTo(this.collection, 'update', this.render);
    },

    render: function() {
        var listItems = this.template({ subbreddits: this.collection });
        this.$el.html(listItems);
        return this;
    }
});

var homeView = new HomeView();
$('#content').html(homeView.render().el);









