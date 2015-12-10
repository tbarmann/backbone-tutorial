
// uses People view
(function(){
	window.App = { 
		Models: {},
		Collections: {},
		Views: {},
		Router: {}
	};
	window.template =  function(id) {
		return _.template($('#' + id).html());

	};


})();



// Person Model
App.Models.Person = Backbone.Model.extend ({});

// List of People
App.Collections.People = Backbone.Collection.extend({
	model: App.Models.Person
});



App.Views.Person = Backbone.View.extend({
	tagName: 'li',
	template: template ('personTemplate'),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
		events: {
		'click' : 'showPersonDetail'
	},
	showPersonDetail: function () {
		console.log(this.model.cid);
		myRouter.navigate('show/' + this.model.cid,{trigger:true});
	}
	
});

App.Views.PersonDetail = Backbone.View.extend({
	tagName: 'div',
	template: template ('personDetailTemplate'),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
		events: {
		'click' : 'goHome'
	},
	goHome: function () {
		console.log("Going home");
		myRouter.navigate('/',{trigger:true});
	}
	
});

App.Views.People = Backbone.View.extend({
	tagName: 'ul',
	initialize: function(){
		this.collection.on('add',this.addOne,this);
	},
	render: function () {
		this.collection.each(this.addOne, this);
		return this;
	},
	addOne: function(person) {
		var personView = new App.Views.Person({model:person});
		this.$el.append(personView.render().el);

	}
});




	App.Router = Backbone.Router.extend({
		routes: {
			'':'index',
			'show/:id': 'show',
			'*default' : 'index'
		},
		index: function(){
			var peopleView = new App.Views.People({collection: peopleCollection});
			$('#main-container').html(peopleView.render().el);
			console.log("Index route has been called");
		},
		show: function(id){
			console.log("Show route has been called with id: " + id);
			var personDetail = peopleCollection.get({cid:id});
			var personDetailView = new App.Views.PersonDetail({model: personDetail});
			$('#main-container').html(personDetailView.render().el);
		},
		default: function(def) {
			console.log("No route for: " + def);
		}
	});

var peopleCollection = new App.Collections.People();
var myRouter = {};

peopleCollection.fetch({
	url: 'js/people.json',
	success: function(){
		console.log("People loaded!");
		myRouter = new App.Router();
		Backbone.history.start();
	}
});






