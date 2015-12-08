
// uses People view


var template = function(id){
	return _.template( $('#' + id).html() );
};

// Person Model
var Person = Backbone.Model.extend ({});

// List of People
var PeopleCollection = Backbone.Collection.extend({
	model: Person
});

var peopleCollection = new PeopleCollection();




var PersonView = Backbone.View.extend({
	tagName: 'li',
	template: template ('personTemplate'),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
	
});



peopleCollection.fetch({
	url: 'js/people.json',
	success: function(data){
		console.log("People loaded!");
		var arr = peopleCollection.toJSON();
		$.each(arr, function(key,value){
			var person = new Person(value);
			var personView = new PersonView({model:person});
			$('#people-container').append(personView.render().el);

		});
	}
});






