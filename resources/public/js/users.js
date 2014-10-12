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

		$.when.apply(this, users).then(function () {
			console.log("All finished!")
		})
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
	template: _.template($('#item-template').html()),
	initialize: function () {
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'sync', this.render);
	},
	render: function () {
		this.$el.html(this.template(this.model.toJSON()));

		if (this.model.isNew() || this.model.hasChanged()) {
			this.$el.prepend($('<span>').text('*'));
		}
		return this;
	},
	clean: function  () {
		this.model.destroy()
	},
	toggle: function () {
		this.$el.find('.edit').prop('disabled', true);
		this.$el.find('.view').hide();
		this.$el.find('input').show();
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