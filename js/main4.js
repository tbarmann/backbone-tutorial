
// uses People view
(function(){
	window.App = { 
		Models: {},
		Collections: {},
		Views: {}
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
	initialize: function() {
		this.model.on('change',this.render,this);
		this.model.on('destroy',this.remove,this);
	},
	template: template ('personTemplate'),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	events: {
		'click .edit' : 'editPerson',
		'click .delete' : 'destroyPerson'
	},
	editPerson: function () {
		var newName = prompt("Please enter new name",this.model.get('name'));
		if (!newName) {
			return;
		}
		this.model.set('name',newName);
	},
	destroyPerson: function () {
		this.model.destroy();
	},
	remove: function() {
		this.$el.remove();
	}
	
});

App.Views.AddPerson = Backbone.View.extend({
	el: '#addPerson',
	events: {
		'submit' : 'submit'
	},
	submit: function(e) {
		console.log("Here");
		e.preventDefault();
		var thisPerson = JSON.stringify($(e.currentTarget).serializeArray());
		console.log(thisPerson);
	}



})

App.Views.People = Backbone.View.extend({
	tagName: 'ul',
	render: function () {
		this.collection.each(function(person){
			var personView = new App.Views.Person({model:person});
			this.$el.append(personView.render().el);
		}, this);
		return this;
	}
});

var addPersonView = new App.Views.AddPerson({ collection: peopleCollection });

var peopleCollection = new App.Collections.People();


peopleCollection.fetch({
	url: 'js/people.json',
	success: function(){
		console.log("People loaded!");
		var peopleView = new App.Views.People({collection: peopleCollection});
		$('#people-container').append(peopleView.render().el);
	}
});






