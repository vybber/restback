Backbone.ajax = function() {
	var args = Array.prototype.slice.call(arguments, 0);
	//jQuery ajax fix for 201 and 200 empty responses
	if (args[0].type == 'POST' || args[0].type == 'PUT') {
		args[0].dataType = 'text';
	}

	return Backbone.$.ajax.apply(Backbone.$, args);
};

var UserModel = Backbone.Model.extend({
	parse: function (resp, options) {
		var locationHeader = options.xhr.getResponseHeader('Location');
		if (locationHeader) {
			return _.extend(this.attributes, 
				{
					id: _.last(locationHeader.split('/'))
				});
		}
		if (!resp) {
			return this.attributes;
		}
		return resp;
	},
	sync: function (method, model, options) {
		// can be overriden behiavor for PUT, 
		// for example if update require POST action with id
		/*
		if (method == 'update') {
			method = 'create';
		}*/
		 
		Backbone.sync.call(this, method, model, options);
	}
});

var UserCollection = Backbone.Collection.extend({
	model: UserModel,
	url: 'users',
	save: function  () {
		return _.chain(this.models)
			.filter(function  (user) {	return user.isNew() || user.hasChanged(); })
			.map(function (user) { return user.save(); })
			.value();
	}
});

var getUserFromImput = function(el) {
	var login = el.find('input[name="login"]');
	var firstname = el.find('input[name="firstname"]');
	var lastname = el.find('input[name="lastname"]');
	var address = el.find('input[name="address"]');

	return {
		login: login.val(),
		firstname: firstname.val(),
		lastname: lastname.val(),
		address: address.val()
	};
};

var NewUserView = Backbone.View.extend({
	events: {
		'click .add': 'addUser'
	},
	addUser: function () {
		this.model.add(new UserModel(getUserFromImput(this.$el)));
		this.$el.find('input').val('');
		this.$el.find('input[name=login]').focus();
	}
});

var UserItemView = Backbone.View.extend({
	tagName: 'li',
	events: {
		'click .delete': 'clean',
		'click .edit': 'toggle'
	},
	template: _.template(_.unescape($('#item-template').html())),
	initialize: function () {
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'all', this.logEvents);
	},
	render: function () {
		this.$el.html(this.template(this.model.toJSON()));

		if (this.model.isNew() || this.model.hasChanged()) {
			this.$el.prepend($('<span>').text('*'));
		}
		return this;
	},
	logEvents: function () {
		console.log(arguments);
	},
	clean: function  () {
		this.model.destroy()
	},
	toggle: function () {
		var button = this.$el.find('.edit');
		if (button.text() == 'Edit') {
			button.text('OK');
			this.$el.find('.view').hide();
			this.$el.find('input').show();
		} else {
			this.model.set(getUserFromImput(this.$el));
		}
	}
});

var App = Backbone.View.extend({
	el: $('.container'),
	events: {
		'click .save': 'saveUsers'
	},
	initialize: function () {

		var newUserView = new NewUserView({
			model: this.model,
			el: $('.new-user')
		});		

		this.listenTo(this.model, 'add', this.addUser);

		this.model.fetch();
	},
	saveUsers: function () {
		var promises = this.model.save();

		$.when.apply(promises).then(function () {
			console.log('All finished!');
		});
	},
	addUser: function (user) {
		this.$el.find('.list-users ul')
			.append(new UserItemView({model: user}).render().el);
	}
});

var usersCollection = new UserCollection();

var app = new App({
	model: usersCollection
});