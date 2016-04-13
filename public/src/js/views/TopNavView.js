var Backbone = require('backbone');

var TopNavView = Backbone.View.extend({
	el: '<nav class="top-bar" data-topbar role="navigation">' +
			'<ul class="title-area">' +
			    '<li class="name">' +
			      '<h1><a href="#">Breddit</a></h1>' +
			    '</li>' +
			    '<li class="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>' +
			'</ul>' +
			'<section class="top-bar-section">' +
			    '<ul class="right">' +
			      '<li class="active"><a href="#">Right Button Active</a></li>' +
			      '<li class="has-dropdown">' +
			        '<a href="#">Right Button Dropdown</a>' +
			        '<ul class="dropdown">' +
			          '<li><a href="/logout">Logout</a></li>' +
			          '<li class="active"><a href="#">Active link in dropdown</a></li>' +
			        '</ul>' +
			      '</li>' +
			    '</ul>' +
			    '<ul class="left">' +
			      '<li><a href="#">Left Nav Button</a></li>' +
			    '</ul>' +
			'</section>' +
		'</nav>',

	render: function() {
		$(document).foundation('topbar', 'reflow');
		return this;
	}
		
});

module.exports = TopNavView;