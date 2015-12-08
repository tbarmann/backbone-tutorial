
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



var PeopleView = Backbone.View.extend({
	tagName: 'ul',
	render: function () {
		this.collection.each(function(person){
			var personView = new PersonView({model:person});
			this.$el.append(personView.render().el);
		}, this);
		return this;
	}
});

peopleCollection.fetch({
	url: 'js/people.json',
	success: function(){
		console.log("People loaded!");
		var peopleView = new PeopleView({collection: peopleCollection});
		$('#people-container').append(peopleView.render().el);
	}
});






