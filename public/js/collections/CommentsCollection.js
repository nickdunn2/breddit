var CommentModel = require('../models/CommentModel.js');

var CommentsCollection = Backbone.Collection.extend({
    url: '/api/comments',
    model: CommentModel
});

module.exports = CommentsCollection;