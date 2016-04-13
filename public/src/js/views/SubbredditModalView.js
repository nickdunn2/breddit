var Backbone = require('backbone');
var _ = require('underscore');

var SubbredditModel = require('../models/SubbredditModel.js');

var SubbredditModalView = Backbone.View.extend({
	tagName: 'div',

	template: _.template(
		'<h3>Add A Subbreddit</h3>' +
		'<form>' +
		    '<input type="text" name="name" />' +
		    '<textarea name="description"></textarea>' +
		    '<input class="button" type="submit" value="Add Subbreddit" />' +
		'</form>' +
		'<a class="close-reveal-modal" aria-label="Close">&#215;</a>'
	),

	events: {
		'submit form': 'addSubbreddit'
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

    render: function() {
    	this.$el.html(this.template);
    	return this;
    }
});

module.exports = SubbredditModalView;