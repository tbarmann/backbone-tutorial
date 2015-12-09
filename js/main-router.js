(function(){

	window.App = {
		Models: {},
		Collections: {},
		Views: {},
		Router: {}
	};



	App.Router = Backbone.Router.extend({
		routes: {
			'':'index',
			'show/:id': 'show',
			'download/*random' : 'download',
			'search/:query' : 'search',
			'*default' : 'default'
		},
		index: function(){
			console.log("Index route has been called");
		},
		show: function(id){
			console.log("Show route has been called with id: " + id);
		},
		download: function(random) {
			console.log("Download route has been called with random: " + random);
		},
		search: function(query) {
			console.log("Searching for: " + query);
		},
		default: function(def) {
			console.log("No route for: " + def);
		}
	});

	new App.Router;
	Backbone.history.start();

})();