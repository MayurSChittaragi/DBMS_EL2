import React, { useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import forecastData from '../forecast.json';

import {
	Tooltip,
	BarChart,
	XAxis,
	YAxis,
	Legend,
	CartesianGrid,
	Bar,
} from 'recharts';

const refactorData = (forecastData) => {
	const formattedData = [];
	for (let i = 0; i < Object.keys(forecastData.ds).length; i++) {
		const timestamp = new Date(forecastData.ds[i]).toLocaleDateString();
		const sales = forecastData.yhat[i];
		formattedData.push({ day: timestamp, Sales: sales });
	}
	return formattedData;
};

const AdminDashboard = () => {
	const {
		user: { _id, name, email, role },
	} = isAuthenticated();

	// useEffect(() => {
	// 	// console.log(forecastData);
	// 	console.log(refactorData(forecastData));
	// }, []);

	const adminLinks = () => {
		return (
			<div className='card'>
				<h4 className='card-header'>Admin Links</h4>
				<ul className='list-group'>
					<li className='list-group-item'>
						<Link className='nav-link' to='/create/category'>
							Create category
						</Link>
					</li>
					<li className='list-group-item'>
						<Link className='nav-link' to='/create/product'>
							Create product
						</Link>
					</li>
					<li className='list-group-item'>
						<Link className='nav-link' to='/admin/orders'>
							View Orders
						</Link>
					</li>
					<li className='list-group-item'>
						<Link className='nav-link' to='/admin/products'>
							Manage Products
						</Link>
					</li>
				</ul>
			</div>
		);
	};

	const adminInfo = () => {
		return (
			<div className='card mb-5'>
				<h3 className='card-header'>User information</h3>
				<ul className='list-group'>
					<li className='list-group-item'>{name}</li>
					<li className='list-group-item'>{email}</li>
					<li className='list-group-item'>
						{role === 1 ? 'Admin' : 'Registered user'}
					</li>
				</ul>
			</div>
		);
	};

	const graph = () => {
		const data = refactorData(forecastData);
		const finalData = data.slice(Math.max(data.length - 5, 0));
		// console.log(temp);
		return (
			<div className='card mb-5'>
				<h3 className='card-header'>Forecasting</h3>
				<ul className='list-group'>
					<li className='list-group-item'>
						<div>
							<BarChart
								width={1100}
								height={400}
								data={data}
								margin={{
									top: 10,
									right: 5,
									left: 5,
									bottom: 5,
								}}
								barSize={20}
							>
								<XAxis
									dataKey='day'
									scale='point'
									padding={{ left: 5, right: 5 }}
								/>
								<YAxis />
								<Tooltip />
								<Legend />
								<CartesianGrid strokeDasharray='3 3' />
								<Bar
									dataKey='Sales'
									fill='#8884d8'
									background={{ fill: '#eee' }}
								/>
							</BarChart>
						</div>
					</li>
				</ul>
			</div>
		);
	};

	return (
		<Layout
			title='Dashboard'
			description={`${name}`}
			className='container-fluid'
		>
			<div className='row'>
				<div className='col-md-2'>{adminLinks()}</div>
				<div className='col'>
					<div className='row-md-2'>{adminInfo()}</div>
					<div className='row-md-5'>{graph()}</div>
				</div>
			</div>
		</Layout>
	);
};

export default AdminDashboard;
