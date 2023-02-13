const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { pool } = require('../db.js');

exports.orderById = (req, res, next, id) => {
	Order.findById(id)
		.populate('products.product', 'name price')
		.exec((err, order) => {
			if (err || !order) {
				return res.status(400).json({
					error: errorHandler(err),
				});
			}
			req.order = order;
			next();
		});
};

exports.create = (req, res) => {
	// console.log('CREATE ORDER: ', req.body);
	req.body.order.user = req.profile;
	const order = new Order(req.body.order);
	order.save((error, data) => {
		if (error) {
			return res.status(400).json({
				error: errorHandler(error),
			});
		}
		res.json(data);
	});
};

exports.listOrders = async (req, res) => {
	// Order.find()
	//   .populate('user', '_id name address')
	//   .sort('-created')
	//   .exec((err, orders) => {
	//     if (err) {
	//       return res.status(400).json({
	//         error: errorHandler(error),
	//       });
	//     }
	//     res.json(orders);
	//   });
	const user_id = req.params?.userId;
	console.log(user_id);

	const sql = `SELECT * FROM BILLING WHERE customer_id=${user_id}`;
	const [data] = await pool.execute(sql);
	console.log(data);
	res.json(data);
};

exports.getStatusValues = (req, res) => {
	res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = (req, res) => {
	Order.update(
		{ _id: req.body.orderId },
		{ $set: { status: req.body.status } },
		(err, order) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler(err),
				});
			}
			res.json(order);
		}
	);
};
