import mysql from 'mysql';

export const db = mysql.createPool({
	host: 'localhost',
	user: 'dbms',
	password: '12345678',
	database: 'DBMS_EL',
	connectionLimit: 10,
});
