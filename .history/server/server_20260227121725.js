require("dotenv").config();
console.log("DB_NAME:", process.env.DB_NAME);

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

app.get("/api/distinct/:table/:column", async (req, res) => {
    try {
        const{ table, column } = req.params;
        // whitelist for SQL injection
        const allowed = {
            Trees: ["species", "CommonName", "AGCT", "ACProd", "NWIStatus"]
        };
        if(!allowed[table] || !allowed[table].includes(column)){
            return res.status(400).json({error: "Invalid table or column"});
        }
        const [rows] = await pool.query(
            `SELECT DISTINCT ?? FROM ?? ORDER BY ??`,
            [column, table, column]
        );
        res.json(rows.map(r => r[column]).filter(Boolean));
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

app.get("/api/filter", async (req, res) => {
    console.log("QUERY:", req.query);
  try {
    const species = (req.query.species || "").trim();
    const CommonName = (req.query.CommonName || "").trim();
    const agct = (req.query.agct || "").trim();

    let sql = "SELECT CommonName, species, AGCT, ACProd FROM Trees";
    const where = [];
    const params = [];

    if (species) { where.push("LOWER(species) = LOWER(?)"); params.push(species); }
    if (CommonName) { where.push("CommonName = ?"); params.push(CommonName); }
    if (agct) { where.push("LOWER(AGCT) = LOWER(?)"); params.push(agct); }
    if (acprod) { where.push("LOWER(ACProd) = LOWER(?)"); params.push(acprod)}

    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY TreeId LIMIT 200";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});