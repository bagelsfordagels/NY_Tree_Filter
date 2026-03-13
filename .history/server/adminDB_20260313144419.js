 const mysql = require("mysql2/promise");


 const adminPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_ADMIN_USER,
  password: process.env.DB_ADMIN_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
 });

 module.export = adminPool