const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { pool } = require('../db.js');

exports.orderById = (req, res, next, id) => {
	// Order.findById(id)
	// 	.populate('products.product', 'name price')
	// 	.exec((err, order) => {
	// 		if (err || !order) {
	// 			return res.status(400).json({
	// 				error: errorHandler(err),
	// 			});
	// 		}
	// 		req.order = order;
	// 		next();
	// 	});
	next();
};

exports.create = async (req, res) => {
	console.log('CREATE ORDER: ');
	req.body.order.user = req.profile;
	console.log(req.body.order);
	let order = req.body.order;
	const sql = `INSERT INTO BILLING(totalAmt, prod_id, count, customer_id) VALUES(${order.amount}, ${order.products[0]._id}, ${order.products[0].count}, ${order.user.cust_id})`;
	const [data] = await pool.execute(sql);

	console.log(data.insertId);

	// const [InsertedOrder] = await pool.execute(
	// 	`SELECT * FROM BILLING WHERE bill_id=${data.insertId}`
	// );

	// const [prod] = await pool.execute(
	// 	`SELECT * FROM PRODUCT WHERE prod_id=${InsertedOrder.prod_id}`
	// );
	// const [users] = await pool.execute(
	// 	`SELECT * FROM CUSTOMER WHERE cust_id=${InsertedOrder.customer_id}`
	// );

	// console.log(users, 'users');

	// console.log(prod, 'products');
	// const newObj = {
	// 	_id: InsertedOrder.bill_id,
	// 	amount: InsertedOrder.totalAmt,
	// 	products: prod,
	// 	status: InsertedOrder.status,
	// 	transaction_id: 1,
	// 	user: currUser,
	// };
	// // return newObj;
	return res.json(data);
	// const order = new Order(req.body.order);
	// order.save((error, data) => {
	// 	if (error) {
	// 		return res.status(400).json({
	// 			error: errorHandler(error),
	// 		});
	// 	}
	// 	res.json(data);
	// });
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
	const newData = await Promise.all(
		data.map(async (order) => {
			const [prod] = await pool.execute(
				`SELECT * FROM PRODUCT WHERE prod_id=${order.prod_id}`
			);
			let newRes = [
				{
					// sold: 0,
					_id: prod[0].prod_id,
					name: prod[0].prod_name,
					// description: prod.description,
					price: prod[0].price,
					// quantity: prod.quantity,
					// category,
					// shipping: false,
					// image: prod.Images,
					count: order.count,
				},
			];
			const [users] = await pool.execute(
				`SELECT * FROM CUSTOMER WHERE cust_id=${order.customer_id}`
			);

			let currUser = [
				{
					name: users[0].cust_name,
					_id: users[0].cust_id,
				},
			];

			console.log(users, 'users');

			console.log(prod, 'products');
			const newObj = {
				_id: order.bill_id,
				amount: order.totalAmt,
				products: newRes,
				status: order.status,
				transaction_id: 1,
				user: currUser,
			};
			return newObj;
		})
	);
	res.json(newData);
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
