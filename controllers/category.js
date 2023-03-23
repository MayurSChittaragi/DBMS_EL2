const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { db } = require('../db.js');

exports.categoryById = (req, res, next, id) => {
	// Category.findById(id).exec((err, category) => {
	//   if (err || !category) {
	// return res.status(400).json({
	//   error: "Category doesn't exist",
	// });
	//   }
	//   req.category = category;
	//   next();
	// });
	const q = 'SELECT * FROM CATEGORY where category_id=?';
	db.query(q, [id], (err, result) => {
		if (err || result.length === 0) {
			return res.status(400).json({
				err,
				error: "Category doesn't exist",
			});
		}
		req.category = result[0];
		next();
	});
};

exports.create = (req, res) => {
	// console.log(req.body);
	// // { name: 'new' }
	// const category = new Category(req.body);
	// category.save((err, data) => {
	// 	if (err) {
	// 		return res.status(400).json({
	// 			error: errorHandler(err),
	// 		});
	// 	}
	// 	res.json({ data });
	// });
	// console.log('In create function');
	const q = 'SELECT * FROM CATEGORY where name=?';
	db.query(q, [req.body.name], (err, result) => {
		if (err || result.length !== 0) {
			return res.status(400).json({
				err: err,
				error: 'CATEGORY already exists!',
			});
		}
		console.log(result, 'q');
		const q1 = 'INSERT INTO CATEGORY(name) VALUES(?)';
		db.query(q1, [req.body.name], (err, result) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}
			console.log(result, 'q1');

			const q2 = 'SELECT * FROM CATEGORY where category_id=?';
			db.query(q2, [result.insertId], (err, result) => {
				if (err)
					res.status(500).json({
						error: err,
					});
				console.log(result, 'q2');
				res.status(200).send({
					data: result[0],
					message: 'Category added Successfully',
				});
			});
		});
	});
};

exports.read = (req, res) => {
	return res.json(req.category);
};

exports.update = (req, res) => {
	// console.log('req.body', req.body);
	// console.log('category update param', req.params.categoryId);
	const category = req.category;
	category.name = req.body.name;
	category.save((err, data) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler(err),
			});
		}
		res.json(data);
	});
};

exports.remove = (req, res) => {
	const category = req.category;
	category.remove((err, data) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler(err),
			});
		}
		res.json({
			message: 'Category deleted',
		});
	});
};

exports.list = (req, res) => {
	// Category.find().exec((err, data) => {
	// 	if (err) {
	// 		return res.status(400).json({
	// 			error: errorHandler(err),
	// 		});
	// 	}
	// 	res.json(data);
	// });
	const q = 'SELECT * FROM CATEGORY';
	db.query(q, (err, result) => {
		if (err) res.status(401).json({ error: err });
		console.log(result);
		res.json(result);
	});
};
