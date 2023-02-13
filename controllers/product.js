const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { db, pool } = require('../db.js');
const product = require('../models/product');

exports.productById = async (req, res, next, id) => {
	const sql = `SELECT * FROM PRODUCT WHERE prod_id=${id}`;
	const [data] = await pool.execute(sql);
	// if (data.length() === 0) res.status(500).json('SQL req error');
	const prod = data[0];
	// console.log(prod);
	let newRes = null;
	let category = await getCategory(prod.category_id);
	newRes = {
		sold: 0,
		_id: prod.prod_id,
		name: prod.prod_name,
		description: prod.description,
		price: prod.price,
		quantity: prod.quantity,
		category,
		shipping: false,
		image: prod.Images,
	};
	console.log(newRes, 'newRes at productId');
	res.json(newRes);
	next();
};

exports.read = async (req, res) => {
	// req.product.photo = undefined;
	// return res.json(req.product);
	console.log(read);
	const sql = `SELECT * FROM PRODUCT WHERE prod_id=${id}`;
	const [data] = await pool.execute(sql);
	const prod = data[0];
	// console.log(prod);
	let newRes = null;
	let category = await getCategory(prod.category_id);
	newRes = {
		sold: 0,
		_id: prod.prod_id,
		name: prod.prod_name,
		description: prod.description,
		price: prod.price,
		quantity: prod.quantity,
		category,
		shipping: false,
		image: prod.Images,
	};
	console.log(newRes, 'newRes at read');
};

exports.create = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, async (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: 'Image could not be uploaded',
			});
		}
		console.log(req.params?.userId, 'userId');
		// check for all fields
		const { name, description, price, category, quantity, shipping } =
			fields;
		// console.log(fields);
		if (
			!name ||
			!description ||
			!price ||
			!category ||
			!quantity ||
			!shipping
		) {
			return res.status(400).json({
				error: 'All fields are required',
			});
		}

		let product = new Product({
			name,
			description,
			price,
			quantity,
			category,
			shipping,
		});

		let imageURL;

		// 1kb = 1000
		// 1mb = 1000000
		console.log(files);
		if (files.photo.path) {
			await cloudinary.uploader
				.upload(files.photo.path, {
					resource_type: 'image',
				})
				.then((result) => {
					console.log('Successful Image Upload', result.url);
					imageURL = result.url;
				})
				.catch((err) => {
					console.log(err);
				});
		}
		console.log('imageURL', imageURL);
		await product.save((err, result) => {
			if (err) {
				console.log('PRODUCT CREATE ERROR ', err);
				return res.status(400).json({
					error: errorHandler(err),
				});
			}
			const image_id = result._id.toString();
			console.log(image_id);
			// res.json(result);
			const q =
				'INSERT INTO PRODUCT (`prod_name`, `quantity`, `description`, `price`, `category_id`, `seller_id`, `Images`) VALUES (?, ?, ?, ?, ?, ?, ?)';
			db.query(
				q,
				[
					name,
					Number(quantity),
					description,
					Number(price),
					Number(category),
					Number(req.params.userId),
					imageURL,
				],
				(err, storedInfo) => {
					if (err) {
						console.log(err, 'sql error');
						return res.status(400).json({ error: err, result });
					}
					console.log(storedInfo, 'stored Info');
					res.status(200).json({
						...result,
						category,
					});
				}
			);
		});
	});
};

exports.remove = (req, res) => {
	let product = req.product;
	product.remove((err, deletedProduct) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler(err),
			});
		}
		res.json({
			message: 'Product deleted successfully',
		});
	});
};

exports.update = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: 'Image could not be uploaded',
			});
		}

		let product = req.product;
		product = _.extend(product, fields);

		console.log(product);

		// 1kb = 1000
		// 1mb = 1000000

		if (files.photo) {
			// console.log("FILES PHOTO: ", files.photo);
			if (files.photo.size > 1000000) {
				return res.status(400).json({
					error: 'Image should be less than 1mb in size',
				});
			}
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
		}

		product.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler(err),
				});
			}
			res.json(result);
		});
	});
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.list = (req, res) => {
	let order = req.query.order ? req.query.order : 'asc';
	let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
	let limit = req.query.limit ? parseInt(req.query.limit) : 6;
	/*
	Product.find()
		.select('-photo')
		// .populate('category')
		.sort([[sortBy, order]])
		.limit(limit)
		.exec((err, products) => {
			if (err) {
				return res.status(400).json({
					error: 'Products not found',
				});
			}
			res.json(products);
		});
		*/
	//top function result
	// {
	// 	"sold": 0,
	// 	"_id": "63e8c8b9de052a35fc8320f6",
	// 	"name": "minecraft 1",
	// 	"description": "hello",
	// 	"price": 10,
	// 	"quantity": 100,
	// 	"category": 1,
	// 	"shipping": false,
	// 	"createdAt": "2023-02-12T11:08:41.752Z",
	// 	"updatedAt": "2023-02-12T11:08:41.752Z",
	// 	"__v": 0
	//   }

	// below function result
	// {
	// 	"prod_id": 4,
	// 	"prod_name": "hello",
	// 	"quantity": 199,
	// 	"Images": null,
	// 	"seller_id": 21,
	// 	"bill_id": null,
	// 	"category_id": 1,
	// 	"description": "hello",
	// 	"price": 100
	//   },

	const q = 'SELECT * FROM PRODUCT';
	db.query(q, async (err, result) => {
		if (err) {
			console.log(err, 'sql error');
			return res.status(400).json({ error: err, result });
		}

		const newResult = await Promise.all(
			result.map(async (prod) => {
				let newRes = null;
				let category = await getCategory(prod.category_id);
				newRes = {
					sold: 0,
					_id: prod.prod_id,
					name: prod.prod_name,
					description: prod.description,
					price: prod.price,
					quantity: prod.quantity,
					category,
					shipping: false,
					image: prod.Images,
				};
				// console.log(newRes, 'newRes');
				return newRes;
			})
		);

		// console.log(newResult, 'newResult');
		res.json(newResult);
	});
};

//utils functions

const getCategory = async (category_id) => {
	const q1 = `SELECT * FROM CATEGORY WHERE category_id=${category_id}`;
	const [data] = await pool.execute(q1);
	return data[0];
};

//utils function

exports.listRelated = (req, res) => {
	const q = 'SELECT * FROM PRODUCT';
	db.query(q, async (err, result) => {
		if (err) {
			console.log(err, 'sql error');
			return res.status(400).json({ error: err, result });
		}

		const newResult = await Promise.all(
			result.map(async (prod) => {
				let newRes = null;
				let category = await getCategory(prod.category_id);
				newRes = {
					sold: 0,
					_id: prod.prod_id,
					name: prod.prod_name,
					description: prod.description,
					price: prod.price,
					quantity: prod.quantity,
					category,
					shipping: false,
					image: prod.Images,
				};
				// console.log(newRes, 'newRes');
				return newRes;
			})
		);
		// newResult = [...newResult];

		console.log(newResult, 'newResult');
		res.json(newResult);
	});
};

exports.listCategories = async (req, res) => {
	// Product.distinct('category', {}, (err, categories) => {
	// 	if (err) {
	// 		return res.status(400).json({
	// 			error: 'Categories not found',
	// 		});
	// 	}
	// 	res.json(categories);
	// });

	const sql2 = `SELECT * FROM CATEGORY WHERE category_id IN (SELECT DISTINCT(category_id) FROM PRODUCT)`;
	const [data] = await pool.execute(sql2);
	res.json(data);
};

exports.listBySearch = (req, res) => {
	let order = req.body.order ? req.body.order : 'desc';
	let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
	let limit = req.body.limit ? parseInt(req.body.limit) : 100;
	let skip = parseInt(req.body.skip);
	let findArgs = {};

	// console.log(order, sortBy, limit, skip, req.body.filters);
	// console.log("findArgs", findArgs);

	for (let key in req.body.filters) {
		if (req.body.filters[key].length > 0) {
			if (key === 'price') {
				// gte -  greater than price [0-10]
				// lte - less than
				findArgs[key] = {
					$gte: req.body.filters[key][0],
					$lte: req.body.filters[key][1],
				};
			} else {
				findArgs[key] = req.body.filters[key];
			}
		}
	}

	Product.find(findArgs)
		.select('-photo')
		.populate('category')
		.sort([[sortBy, order]])
		.skip(skip)
		.limit(limit)
		.exec((err, data) => {
			if (err) {
				return res.status(400).json({
					error: 'Products not found',
				});
			}
			res.json({
				size: data.length,
				data,
			});
		});
};

exports.photo = (req, res, next) => {
	if (req.product.photo.data) {
		res.set('Content-Type', req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

exports.listSearch = (req, res) => {
	// create query object to hold search value and category value
	const query = {};
	// assign search value to query.name
	if (req.query.search) {
		query.name = { $regex: req.query.search, $options: 'i' };
		// assigne category value to query.category
		if (req.query.category && req.query.category != 'All') {
			query.category = req.query.category;
		}
		// find the product based on query object with 2 properties
		// search and category
		Product.find(query, (err, products) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler(err),
				});
			}
			res.json(products);
		}).select('-photo');
	}
};

exports.decreaseQuantity = (req, res, next) => {
	let bulkOps = req.body.order.products.map((item) => {
		return {
			updateOne: {
				filter: { _id: item._id },
				update: { $inc: { quantity: -item.count, sold: +item.count } },
			},
		};
	});

	Product.bulkWrite(bulkOps, {}, (error, products) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not update product',
			});
		}
		next();
	});
};
