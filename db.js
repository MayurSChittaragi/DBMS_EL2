const mysql = require("mysql");
const mysql2 = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Legolego",
  database: "DBMS_EL",
  connectionLimit: 10,
});

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "Legolego",
  database: "DBMS_EL",
});

module.exports = { db, pool: pool.promise() };
