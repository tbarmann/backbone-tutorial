
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


App.Views.EditForm = Backbone.View.extend({
	tagName: 'div',
	class: 'form-container',
	template: template('editPersonTemplate'),
	events : {
		'click .save' : 'savePerson',
		'click .cancel' : 'close'
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	savePerson: function(e) {
		e.preventDefault();
		// get values from form
		// save to model
		
		var newValues = this.formToObj();
		console.log(newValues);
		this.model.set(newValues);
		this.close();
	},
	close: function() {
		this.remove();
	},

	formToObj: function(e) {
	var formData = $('#editPerson').serializeArray();
	// formData is array of objects, each with two properties:
	// [{ name: "a", value: "1"},{name: "b",value: "2"}]
	// needs to be single object:
	// {"a":1,"b":2}
	var obj = {};
	$.each(formData, function(){
		obj[this.name] = this.value;
	});
	return obj;
	}


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
		var edit = new App.Views.EditForm({model:this.model});
		$('#edit-form-container').html(edit.render().el);


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
		e.preventDefault();
		var newPerson = this.formToObj(e);
		var person = new App.Models.Person(newPerson);
		console.log(person);
		this.collection.add(person);
	},
	formToObj: function(e) {
		var formData = $(e.currentTarget).serializeArray();
		// formData is array of objects, each with two properties:
		// [{ name: "a", value: "1"},{name: "b",value: "2"}]
		// needs to be single object:
		// {"a":1,"b":2}
		var obj = {};
		$.each(formData, function(){
			obj[this.name] = this.value;
		});
		return obj;
	}



})

App.Views.People = Backbone.View.extend({
	tagName: 'ul',
	initialize: function(){
		this.subViews = [];
		this.collection.on('add',this.addOne,this);
	},
	render: function () {
		this.collection.each(this.addOne, this);
		return this;
	},
	addOne: function(person) {
		var personView = new App.Views.Person({model:person});
		this.subViews.push(personView);
		this.$el.append(personView.render().el);

	},
	close: function (){
		_.each(this.subViews, function(view) {
			 view.remove();
		});
		this.remove();
	}
});

var peopleCollection = new App.Collections.People();

peopleCollection.fetch({
	url: 'js/people.json',
	success: function(){
		console.log("People loaded!");
		var peopleView = new App.Views.People({collection: peopleCollection});
		$('#people-container').append(peopleView.render().el);
	}
});

var addPersonView = new App.Views.AddPerson({ collection: peopleCollection });







