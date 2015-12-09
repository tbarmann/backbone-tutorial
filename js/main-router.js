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
			'show/:id': 'show'
		},
		index: function(){
			$('#container').append("Index route has been called");

		},
		show: function(id){
			$('#container').append("Show route has been called with id: " + id);
		}
	});

	new App.Router;
	Backbone.history.start();

})();