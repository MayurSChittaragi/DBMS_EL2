const mysql = require('mysql');

const db = mysql.createPool({
	host: 'localhost',
	user: 'dbms',
	password: '12345678',
	database: 'DBMS_EL',
	connectionLimit: 10,
});

module.exports = { db };
