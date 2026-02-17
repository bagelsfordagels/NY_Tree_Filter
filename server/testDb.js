require("dotenv").config();
const pool = require("./db");

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result;");
    console.log("Connection successful.");
    console.log("Test query result:", rows[0].result);
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:");
    console.error(err.message);
    process.exit(1);
  }
}

testConnection();