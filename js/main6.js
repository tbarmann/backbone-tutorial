


var MojoPeople = new Marionette.Application();



MojoPeople.Router = Backbone.Router.extend({
	routes: {
		'':'index',
		'show/:id': 'show',
		'*default' : 'index'
	},
	index: function(){
		console.log("Index route has been called");
		var people = MojoPeople.reqres.request('people');
		var peopleListView = new MojoPeople.PeopleView({
			collection: people
		});
		MojoPeople.regions.main.show(peopleListView);
		
	},
	show: function(id){
		console.log("Show route has been called with id: " + id);
		var person = MojoPeople.reqres.request('person',id);
		console.log(person);
		var personDetailView = new MojoPeople.PersonDetailView({
			model: person
		});
		MojoPeople.regions.main.show(personDetailView);
	},
	default: function(def) {
		console.log("No route for: " + def);
	}
});




MojoPeople.Person = Backbone.Model.extend({});

MojoPeople.PersonItemView = Marionette.ItemView.extend({
	tagName: 'li',
	template: '#person-template',
	events: {
		'click' : 'showPersonDetail'
	},
	showPersonDetail: function () {
		console.log(this.model.cid);
		MojoPeople.myRouter.navigate('show/' + this.model.cid,{trigger:true});
	}

});


MojoPeople.PeopleCollection = Backbone.Collection.extend({
	model: MojoPeople.Person,
	url: 'js/people.json'
});


MojoPeople.PeopleView = Marionette.CollectionView.extend({
	tagName: 'ul',
	childView: MojoPeople.PersonItemView
});

MojoPeople.PersonDetailView = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#person-detail-template',
	events: {
		'click' : 'goHome'
	},
	goHome: function () {
		console.log("Going home");
		MojoPeople.myRouter.navigate('/',{trigger:true});
	}
	
});
	



MojoPeople.on('before:start',function(opts){
	var RegionContainer = Marionette.LayoutView.extend({
		el: '#app-container',
		regions: {
			main: '#main-region'
		}
	});
	MojoPeople.regions = new RegionContainer();
	MojoPeople.reqres.setHandlers({
		'people': function(){ 
			return opts.pc;
		},
		'person': function(id){
			console.log("In person", Date.now(), id); 
			return opts.pc.get({cid:id});
		}
	});
});

MojoPeople.on('start',function(){
	MojoPeople.myRouter = new MojoPeople.Router();
	Backbone.history.start();
}); // on

var peopleCollection = new MojoPeople.PeopleCollection();
peopleCollection.fetch().done(function() {
	MojoPeople.start({pc: peopleCollection})
});		





