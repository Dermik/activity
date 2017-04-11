/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new: function (req, res) {
		console.log(this);
		// console.log(res);
		// res.locals.flash = _.clone(req.session.flash);
		res.view();
		// req.session.flash = {}
	},
	'create': function (req, res, next) {

		User.create(req.allParams(), function userCreated (err, user) {
			// console.log(err.invalidAttributes.title[0].message)
			if (err) {
				console.log(err)
				req.session.flash = {
					err: err['details']
				}

				return res.redirect('/user/new');
			}

			res.redirect('user/show/' + user.id);
			// req.session.flash = {};
		})
	},
	show: function (req, res, next) {
		// if(!req.params['id']) return this.index(req,res,next);
		// console.log('wtf?')
		User.findOne(req.params['id'])
		.then(user=>{

			if (!user) return next();

			res.view({
				user
			})
		})
		.catch(err=>next(err))
	},
	index: function (req, res, next) {
		User.find()
		.then(users=>{
			res.view({ users: users })
		})
		.catch(e=>next(e))
	},
	edit: (req, res, next) => {
		User.findOne(req.params['id'])
		.then(user=>{
			if(!user) return next();
			res.view({
				user:user
			})
		})
		.catch(e=>next(e))
	},
	update: (req, res, next)=>{
		User.update(req.params['id'],req.allParams())
		.then(user=>{
			return res.redirect('/user/show/' + req.params['id'])
		})
		.catch(e=>{
			res.redirect('/user/edit/'+req.params['id'])
		})
	},
	destroy: function(req,res,next){
	User.findOne(req.params['id'], function foundUser(err,user){
		if(err) return next(err);
		if(!user) return next('User doesn\'t exists.');
		User.destroy(req.params['id'], function userDestroyed(err){
			if(err) return next(err);
		})
		res.redirect('/user');
	})
}
};
