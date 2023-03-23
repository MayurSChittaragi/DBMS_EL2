import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

import {
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Bar,
} from "recharts";

const AdminDashboard = () => {
	const {
		user: { _id, name, email, role },
	} = isAuthenticated();

	useEffect(() => {
		console.log(forecastData);
	}, []);

  const adminLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">Admin Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/create/category">
              Create category
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/create/product">
              Create product
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/orders">
              View Orders
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/products">
              Manage Products
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const adminInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">
            {role === 1 ? "Admin" : "Registered user"}
          </li>
        </ul>
      </div>
    );
  };

  const graph = () => {
    const data = [
      { day: "2023-02-22", Sales: 3976.281895 },
      { day: "2023-02-23", Sales: 4289.940234 },
      { day: "2023-02-24", Sales: 4603.598572 },
      { day: "2023-02-25", Sales: 4917.256911 },
      { day: "2023-02-26", Sales: 5230.915249 },
      { day: "2023-02-28", Sales: 5544.573588 },
      { day: "2023-03-1", Sales: 5858.231926 },
      { day: "2023-03-2", Sales: 6171.890265 },
      { day: "2023-03-3", Sales: 6485.548603 },
      { day: "2023-03-4", Sales: 6799.206942 },
      { day: "2023-03-5", Sales: 7112.86528 },
    ];
    const finalData = data.slice(Math.max(data.length - 5, 0));
    // console.log(temp);
    return (
      <div className="card mb-5">
        <h3 className="card-header">Forecasting</h3>
        <ul className="list-group">
          <li className="list-group-item">
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
                  dataKey="day"
                  scale="point"
                  padding={{ left: 5, right: 5 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  dataKey="Sales"
                  fill="#8884d8"
                  background={{ fill: "#eee" }}
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
      title="Dashboard"
      description={`${name}`}
      className="container-fluid"
    >
      <div className="row">
        <div className="col-md-2">{adminLinks()}</div>
        <div className="col">
          <div className="row-md-2">{adminInfo()}</div>
          <div className="row-md-5">{graph()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
