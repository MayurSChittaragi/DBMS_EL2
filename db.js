const mysql = require('mysql');
const mysql2 = require('mysql2');

const db = mysql.createPool({
	host: 'localhost',
	user: process.env.SQL_DB_NAME,
	password: process.env.SQL_DB_PASSWORD,
	database: 'DBMS_EL',
	connectionLimit: 10,
});

const pool = mysql2.createPool({
	host: 'localhost',
	user: 'dbms',
	password: '12345678',
	database: 'DBMS_EL',
});

module.exports = { db, pool: pool.promise() };
