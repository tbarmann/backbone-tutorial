


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
		MojoPeople.regions.sidebar.show(peopleListView);
		MojoPeople.vent.trigger("person:show");
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
		'click .icon, .name, .title' : 'showPersonDetail',
		'click .trash' : 'destroyPerson',
		'click .edit' : 'editPerson'
	},
	showPersonDetail: function () {
		MojoPeople.vent.trigger("person:show", this.model);
	},
	destroyPerson: function () {
		//this.model.destroy();
		this.trigger("destroy");
	},

	editPerson: function () {
		this.showPersonDetail();
		var edit = new MojoPeople.EditFormView({model:this.model});
		MojoPeople.regions.edit.show(edit);
	}

});


MojoPeople.PeopleCollection = Backbone.Collection.extend({
	model: MojoPeople.Person,
	url: 'js/people.json'
});


MojoPeople.PeopleView = Marionette.CollectionView.extend({
	initialize: function(){
		this.listenTo(this.collection,'change', this.render);
		this.listenTo(this.collection,'add',this.addOne,this);
	},
	tagName: 'ul',
	childView: MojoPeople.PersonItemView,
	childEvents: {
		"destroy": "destroyChild"
	},
	addOne: function(person) {
		var personView = new MojoPeople.Person({model:person});
		this.$el.append(personView.render().el);

	},
	destroyChild: function(cv) {
		this.collection.remove(cv.model);
		console.log("DEBUG", arguments);
	}
});

MojoPeople.PersonDetailView = Marionette.ItemView.extend({
	initialize: function() {
		this.listenTo(this.model,'change', this.render);
		this.listenTo(this.model,'remove', function(){
			//MojoPeople.vent.trigger("person:show", MojoPeople.request("people").at(0));
			this.destroy();
			console.log("Destroyed");
		});
	},

	template: '#person-detail-template',
	events: {
		}
});
	
MojoPeople.on('before:start',function(opts){
	var RegionContainer = Marionette.LayoutView.extend({
		el: '#app-container',
		regions: {
			sidebar: '#sidebar',
			main: '#main-region',
			edit: '#edit-form'
		}
	});
	MojoPeople.regions = new RegionContainer();
	MojoPeople.regions.listenTo(MojoPeople.vent, 'person:show', function(person) {
		if (person === undefined) {
			person = MojoPeople.request("people").at(0);
		}

		var personDetailView = new MojoPeople.PersonDetailView({model: person});
		person.on("remove", function() {
			person.off();
			MojoPeople.vent.trigger("person:show");
		});
		MojoPeople.regions.main.show(personDetailView);
	});
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


MojoPeople.EditFormView = Marionette.ItemView.extend({
	tagName: 'div',
	class: 'form-container',
	template: '#edit-person-template',
	events : {
		'click .save' : 'savePerson',
		'click .cancel' : 'cancel'
	},
	savePerson: function(e) {
		e.preventDefault();
		// get values from form
		// save to model
		
		var newValues = this.formToObj();
		console.log(newValues);
		this.model.set(newValues);
		this.destroy();


	},
	cancel: function(e) {
		e.preventDefault();
		this.destroy();
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



