require("dotenv").config();

const express = require("express");
const pool = require("./db");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(express.json());
app.use("/api/admin", adminRoutes);

// Basic health check
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok;");
    res.json({ ok: rows[0].ok });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/Trees", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT TreeId, commonName, species FROM Trees ORDER BY TreeId"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});