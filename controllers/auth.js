const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for auth check
const { errorHandler } = require('../helpers/dbErrorHandler');
const { db } = require('../db.js');

require('dotenv').config();

exports.signup = (req, res) => {
	// console.log('req.body', req.body);
	// req.body { name: 'Test', email: 'test@test.com', password: 'test123' }

	// const user = new User(req.body);
	// user.save((err, user) => {
	// 	if (err) {
	// 		return res.status(400).json({
	// 			err: errorHandler(err),
	// 		});
	// 	}
	// 	user.salt = undefined;
	// 	user.hashed_password = undefined;
	// 	res.json({
	// 		user,
	// 	});
	// });

	const q0 = 'SELECT * FROM CUSTOMER WHERE email=?';
	db.query(q0, [req.body.email], (err, result) => {
		if (err) res.status(500).json({ err, message: 'Regn Unsuccessful' });
		if (result.length != 0) {
			res.status(400).json({ err: 'Email already exists' });
		} else {
			const q =
				'INSERT INTO CUSTOMER(cust_name, email, password) VALUES(?,?,?)';
			db.query(
				q,
				[req.body.name, req.body.email, req.body.password],
				async (err, result) => {
					if (err)
						res.status(500).json({
							err,
							message: 'Regn Unsuccessful',
						});
					console.log(result.insertId);
					// const user = await getUser(result.insertId);
					const q2 = 'SELECT * FROM CUSTOMER WHERE cust_id=?';
					db.query(q2, [result.insertId], (err, result) => {
						if (err)
							res.status(500).json({
								err,
								message: 'Regn Unsuccessful',
							});
						const { password, ...user } = result[0];
						res.status(200).send({
							user: user,
							message: 'Registration Successful',
						});
					});
				}
			);
		}
	});
};
exports.adminsignup = (req, res) => {
	// console.log('req.body', req.body);
	// req.body { name: 'Test', email: 'test@test.com', password: 'test123' }

	// const user = new User(req.body);
	// user.save((err, user) => {
	// 	if (err) {
	// 		return res.status(400).json({
	// 			err: errorHandler(err),
	// 		});
	// 	}
	// 	user.salt = undefined;
	// 	user.hashed_password = undefined;
	// 	res.json({
	// 		user,
	// 	});
	// });

	const q0 = 'SELECT * FROM CUSTOMER WHERE email=?';
	db.query(q0, [req.body.email], (err, result) => {
		if (err) res.status(500).json({ err, message: 'Regn Unsuccessful' });
		if (result.length != 0) {
			res.status(400).json({ err: 'Email already exists' });
		} else {
			const q =
				'INSERT INTO CUSTOMER(cust_name, email, password, role) VALUES(?,?,?,?)';
			db.query(
				q,
				[req.body.name, req.body.email, req.body.password, 1],
				async (err, result) => {
					if (err)
						res.status(500).json({
							err,
							error: 'Regn Unsuccessful',
						});
					console.log(result.insertId);
					// const user = await getUser(result.insertId);
					const q2 = 'SELECT * FROM CUSTOMER WHERE cust_id=?';
					db.query(q2, [result.insertId], (err, result) => {
						if (err)
							res.status(500).json({
								err,
								error: 'Regn Unsuccessful',
							});
						const { password, ...user } = result[0];
						const q4 =
							'INSERT INTO SELLER(seller_name, seller_user) VALUES(?, ?)';
						db.query(
							q4,
							[user.cust_name, user.cust_id],
							(err, resu) => {
								if (err) {
									console.log(err);
									res.send({ error: err });
								}
								// console.log(res);
								res.status(200).send({
									user: user,
									message: 'Registration Successful',
								});
							}
						);
					});
				}
			);
		}
	});
};

exports.signin = (req, res) => {
	// find the user based on email
	const { email, password } = req.body;

	/*
	User.findOne({ email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User with that email doesn't exist. Please signup.",
			});
		}
		// if user found make sure the email and password match
		// create authenticate method in user model
		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: "Email and password didn't match",
			});
		}
		// generate a signed token with user id and secret
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
		// persist the token as 't' in cookie with expiry date
		res.cookie('t', token, { expire: new Date() + 9999 });
		// return response with user and token to frontend client
		const { _id, name, email, role } = user;
		console.log(res.json({ token, user: { _id, email, name, role } }));
		return res.json({ token, user: { _id, email, name, role } });
	});
  */

	const q = 'SELECT * FROM CUSTOMER where email=?';
	db.query(q, [email], (error, result) => {
		if (error) res.status(500).send(error);
		if (result?.length != 0) {
			console.log(result[0]);
			if (result[0].password == password) {
				const { password, ...user } = result[0];
				// console.log(user);
				const token = jwt.sign(
					{ _id: user.cust_id },
					process.env.JWT_SECRET
				);
				// persist the token as 't' in cookie with expiry date
				res.cookie('t', token, { expire: new Date() + 9999 });

				return res.json({
					token,
					user: {
						_id: user.cust_id,
						email: user.email,
						name: user.cust_name,
						role: user.role,
					},
				});
			} else {
				res.status(401).send({ error: 'Password is incorrect!' });
			}
		} else {
			res.status(401).send({
				error: "User with that email doesn't exist. Please signup.",
			});
		}
	});
};

exports.signout = (req, res) => {
	res.clearCookie('t');
	res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	// algorithms: ['RS256'],
	userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
	let user = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!user) {
		return res.status(403).json({
			error: 'Access denied',
		});
	}
	next();
};

exports.isAdmin = (req, res, next, id) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: 'Admin resource! Access denied',
		});
	}
	next();
};
