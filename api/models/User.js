/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what
 * it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt');

module.exports = {
	schema: true,
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		title: {
			type: 'string'
		},
		email: {
			type: 'string',
			email: true,
			required: true,
			unique: true
		},
		admin: {
			type: 'boolean',
			defaultsTo: false
		},
		encryptedPassword: {
			type: 'string'
		},
		online: {
			type: 'boolean',
			defaultsTo: false
		},
		toJson() {
			const obj = this.toObject();
			delete obj.password;
			delete obj.confirmation;
			delete obj.encryptedPassword;
			/*eslint-disable no-underscore-dangle*/
			delete obj._csrf;
			/*eslint-enable*/
			return obj;
		}
	}, //end of attributes

	beforeCreate(values, next) {
		if (!values.password || values.password !== values.confirmation) {
			return next({ err: ["Password doesn't match"] });
		}

		bcrypt.hash(values.password, 10, (err, encryptedPassword) => {
			if (err) return next(err);
			values.encryptedPassword = encryptedPassword;
			// values.online = true;
			next();
		});
	}
};
