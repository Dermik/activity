/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const bcrypt = require('bcrypt');

module.exports = {
	new(req, res) {
		res.view('session/new');
	},
	create(req, res) {
		if (!req.param('email') || !req.param('password')) {
			const usernamePasswordRequiredError = [
				{
					name: 'usernamePasswordRequired',
					message: 'You need both'
				}
			];

			req.session.flash = {
				err: usernamePasswordRequiredError
			};
			res.redirect('session/new');
			return;
		}
	// User.findOneByEmail(req.param('email')).done(function(err,user){
		User.findOne({ email: req.param('email') }).exec((err, user) => {
			if (err) return next(err);

			if (!user) {
				const noAccountError = [{ name: 'noAccount', message: 'The email address ' + req.param('email') + ' not found.' }];
				req.session.flash = {
					err: noAccountError
				};
				res.redirect('session/new');
				return;
			}
			bcrypt.compare(req.param('password'), user.encryptedPassword, (error, valid) => {
				if (error) return next(error);

				if (!valid) {
					const usernamePasswordMismatchError = [{ name: 'usernamePasswordMismatch', message: 'Invalid username and password combo' }];
					req.session.flash = {
						err: usernamePasswordMismatchError
					};
					res.redirect('session/new');
					return;
				}

				req.session.authenticated = true;
				req.session.User = user;

				user.online = true;
				user.save((errorInSave) => {
					if (err) return next(errorInSave);
					console.log('Высылаем говно')
					User.publishUpdate(user.id, {
						loggedIn: true,
						id: user.id
					});
					if (req.session.User.admin) {
						res.redirect('/user');
						return;
					}
					res.redirect('/user/show/' + user.id);
				});
			});
		});
	},
	destroy: (req, res) => {
		User.findOne(req.session.User.id, (err, user) => {
			const userId = user.id;

			User.update(userId, {
				online: false
			}, (error) => {
				if (error) return next(error);
				req.session.destroy();

				res.redirect('/session/new');
			});
		});
	}
};
