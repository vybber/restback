Backbone.ajax = function() {
	var args = Array.prototype.slice.call(arguments, 0);

	if (args[0].type == 'POST') {
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
		return resp;
	}
});

var UserCollection = Backbone.Collection.extend({
	model: UserModel,
	url: 'users',
	save: function  () {
		var users = _.chain(this.models)
								.filter(function  (user) {	return user.isNew(); })
								.map(function (user) { return user.save(); })
								.value();

		if (!users.length)
			return;

		$.when.apply(this, users).done(function () {
			console.log(arguments)
		})
	}
});

var NewUserView = Backbone.View.extend({
	events: {
		'click .add': 'addUser'
	},
	addUser: function () {
		var login = this.$el.find('input[name="login"]');
		var firstname = this.$el.find('input[name="firstname"]');
		var lastname = this.$el.find('input[name="lastname"]');
		var address = this.$el.find('input[name="address"]');

		this.model.add(new UserModel({
			login: login.val(),
			firstname: firstname.val(),
			lastname: lastname.val(),
			address: address.val()
		}));

		login.val('');
		firstname.val('');
		lastname.val('');
		address.val('');

		login.focus();
	}
});

var UserItemView = Backbone.View.extend({
	tagName: 'li',
	events: {
		'click .delete': 'clean'
	},
	template: _.template('<span class="hide">*</span><span><%= login %></span><span><%= firstname %></span><span><%= lastname %></span><span><%= address %></span><button class="delete">Delete</button>'),
	initialize: function () {
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'sync', this.render);
	},
	render: function () {
		this.$el.html(this.template(this.model.toJSON()));

		if (this.model.isNew()) {
			this.$el.find('.hide').removeClass('hide');
		}
		return this;
	},
	clean: function  () {
		this.model.destroy()
	}
});

var App = Backbone.View.extend({
	el: $('.container'),
	events: {
		'click .save': 'saveUsers'
	},
	initialize: function () {

		var newUserView = new NewUserView({
			model: usersCollection,
			el: $('.new-user')
		});		

		this.listenTo(this.model, 'add', this.addUser);

		this.model.fetch();
	},
	saveUsers: function () {
		this.model.save();
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