/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new(req, res) {
		console.log(this);
		// console.log(res);
		// res.locals.flash = _.clone(req.session.flash);
		res.view();
		// req.session.flash = {}
	},
	create(req, res) {
		if (typeof a === 'string') {
			console.log('dsa');
		}
		User.create(req.allParams(), (err, user) => {
			// console.log(err.invalidAttributes.title[0].message)
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err.details
				};

				return res.redirect('/user/new');
			}
			req.session.authenticated = true;
			req.session.User = user;

			user.online = true;
			user.save((error) => {
				if (error) return next(err);

				if (req.session.User.admin) {
					req.redirect('/user');
					return;
				}
			});
			res.redirect('user/show/' + user.id);
			// req.session.flash = {};
		});
	},
	show(req, res, next) {
		// if(!req.params['id']) return this.index(req,res,next);
		// console.log('wtf?')
		User.findOne(req.params.id)
		.then(user => {
			if (!user) return next();

			res.view({
				user
			});
		})
		.catch(err => next(err));
	},
	index(req, res, next) {
		if (req.session) {
			console.log(req.session);
		}
		User.find()
		.then(users => {
			res.view({ users });
		})
		.catch(e => next(e));
	},
	edit: (req, res, next) => {
		User.findOne(req.params.id)
		.then(user => {
			if (!user) return next();
			res.view({
				user
			});
		})
		.catch(e => next(e));
	},
	update: (req, res) => {
		const userObj = {
			name: req.param('name'),
			title: req.param('title'),
			email: req.param('email')
		};
		if (req.session.User.admin) {
			userObj.admin = req.param('admin');
		}
		User.update(req.params.id, userObj) //req.allParams()
		.then(() => {
			User.publishCreate(user);
			res.redirect('/user/show/' + req.params.id);
		})
		.catch(e => {
			console.log(e);
			res.redirect('/user/edit/' + req.params.id);
		});
	},
	destroy(req, res, next) {
		User.findOne(req.params.id, (err, user) => {
			if (err) return next(err);
			if (!user) return next('User doesn\'t exists.');
			User.destroy(req.params.id, (error) => {
				if (error) return next(err);
				User.publishDestroy(user.id);
				res.redirect('/user');
			});
		});
	},
	subscribe(req, res) {
		console.log('some asshole subbed');
		User.find((err, users) => {
			User.subscribe(req.socket);
			User.subscribe(req.socket, users);
			return res.send(200);
			// return null;
		});
	}
};
