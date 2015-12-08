
var template = function(id){
	return _.template( $('#' + id).html() );
};

// Person Model
var Person = Backbone.Model.extend ({
	defaults: {
		name: 'Guest User',
		age: 30,
		title: 'worker'

	}
});

// List of People
var PeopleCollection = Backbone.Collection.extend({
	model: Person
});


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

var peopleCollection = new PeopleCollection([
  {
    "name": "Nick Kishfy",
    "title": "Founder & CEO",
    "bio": "Nick has been launching start-ups, leading teams, and shipping products since the first Internet gold rush. Along the way, he&#x2019;s learned that while starting is required, finishing is what matters. Finishing requires skill, focus, and passion&#x2014;in a word, execution&#x2014;and that&#x2019;s what he&#x2019;s built MojoTech to provide. He&#x2019;s dedicated to the never-ending improvement of MojoTech and to helping MojoTech&#x2019;s clients finish what they start.",
    "imagePath": "//mojotech-static.s3.amazonaws.com/m4/people/kishfy.jpg",
    "_url": "/people/nick-kishfy.html"
  },
  {
    "name": "Chris Shoemaker",
    "bio": "Chris has nearly 20 years experience in commercial and open source software engineering. In addition to providing the leadership and expertise to solve clients&#x2019; toughest technology problems, he specializes in web application scalability and database design. Chris has previously worked as a software consultant, a software architect for Internet start-ups, and for five years as a scientist for the U.S. Navy. Chris has a history of open source contributions to projects such as GnuCash, Git, Firefox, and rsync, dating back to 2004. Chris earned a B.S. in Physics and a M.S. in C.S. from WPI.",
    "title": "Partner & CTO",
    "imagePath": "//mojotech-static.s3.amazonaws.com/m4/people/shoemaker.jpg",
    "_url": "/people/chris-shoemaker.html"
  },
  {
    "name": "Duncan Shaw",
    "bio": "Duncan is MojoTech&#x2019;s citizen of the world, bringing loads of software, activation, and business development experience from his time in Australia, Hong Kong, Japan, Europe, and North America. Over the past 20 years, he has guided product, campaign and brand launches for clients of all sizes in technology, CPG, entertainment, financial services and motor sport. When he is not immersed in our clients&#x2019; projects, you might find Duncan torturing himself in preparation for an Ironman triathlon, off the grid in search of whitewater in Nepal or Morocco, or sneaking into a Formula One paddock somewhere exotic.",
    "title": "Managing Director",
    "imagePath": "//mojotech-static.s3.amazonaws.com/m4/people/shaw.jpg",
    "_url": "/people/duncan-shaw.html"
  }
]);

var peopleView = new PeopleView({collection: peopleCollection});
$(document.body).append(peopleView.render().el);




