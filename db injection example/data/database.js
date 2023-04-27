const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "localhost",
  database: "security-demo",
  user: "root",
  password: "passmysql",
 // multipleStatements: true
})

module.exports = pool;