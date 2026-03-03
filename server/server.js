require("dotenv").config();

const express = require("express");
const pool = require("./db");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));
const adminRoutes = require("./routes/admin");

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

app.get("/api/trees", async (req, res) => {
  try {
    const q = (req.query.q || "").toLowerCase();
      let sql = "SELECT TreeId, CommonName, species FROM Trees";
      const params = [];
      if(q){
        sql += " WHERE LOWER(CommonName) LIKE ? OR LOWER(species) LIKE ?";
      }
      params.push(`%${q}%`, `%${q}%`);
      sql += " ORDER BY TreeId";
    const [rows] = await pool.query(sql,params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});