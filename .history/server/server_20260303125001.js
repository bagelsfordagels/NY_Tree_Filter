require("dotenv").config();
console.log("DB_NAME:", process.env.DB_NAME);

const express = require("express");
const pool = require("./db");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));
const adminRoutes = require("./routes/admin");
const { updateSiteChemPref } = require("./model/admin");
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
        // whitelist for SQL injection protection
        const allowed = {
            Trees: ["species", "CommonName", "AGCT", "ACProd", "NWIStatus"],
            LandformPref: ["FloodPlainBottomLand", "UplandMesic", "UplandDry"],
            SiteChemPref: ["SoilAcidTol", "SoilAlkTol", "SoilSaltTol"]
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
    const acprod = (req.query.acprod || "").trim();
    const nwistatus = (req.query.nwistatus || "").trim();
    const floodplainbottomland = (req.query.floodplainbottomland || "").trim();
    const uplandmesic = (req.query.uplandmesic || "").trim();
    const uplanddry = (req.query.uplanddry || "").trim();
    const soilacidtol = (req.query.soilacidtol || "").trim();
    const soilalktol = (req.query.soilalktol || "").trim();
    const soilsalttol = (req.query.soilsalttol || "").trim();


    let sql = `SELECT T.species, T.CommonName, T.AGCT, T.ACProd, T.NWIStatus, 
                      L.FloodPlainBottomLand, L.UplandMesic, L.UplandDry,
                      S.SoilAcidTol, S.SoilAlkTol, S.SoilSaltTol 
                      FROM Trees T 
                      LEFT JOIN LandformPref L ON T.TreeId = L.TreeId
                      LEFT JOIN SiteChemPref S ON T.TreeId = S.TreeId  
              `;
    const where = []; 
    const params = [];

    if (species) { where.push("LOWER(species) = LOWER(?)"); params.push(species); }
    if (CommonName) { where.push("CommonName = ?"); params.push(CommonName); }
    if (agct) { where.push("LOWER(AGCT) = LOWER(?)"); params.push(agct); }
    if (acprod) { where.push("LOWER(ACProd) = LOWER(?)"); params.push(acprod); }
    if (nwistatus) { where.push("LOWER(NWIStatus) = LOWER(?)"); params.push(nwistatus); }
    if (floodplainbottomland) { where.push("LOWER(FloodPlainBottomLand) = LOWER(?)"); params.push(floodplainbottomland); }
    if (uplandmesic) { where.push("LOWER(UplandMesic) = LOWER(?)"); params.push(uplandmesic); }
    if (uplanddry) { where.push("LOWER(UplandDry) = LOWER(?)"); params.push(uplanddry); }
    if (soilacidtol) { where.push("LOWER(SoilAcidTol) = LOWER(?)"); params.push(soilacidtol); }
    if (soilalktol) { where.push("LOWER(SoilAlkTol) = LOWER(?)"); params.push(soilalktol); }
    if (soilsalttol) { where.push("LOWER(SoilSaltTol) = LOWER(?)"); params.push(soilsalttol); }

    if (where.length) sql += " WHERE " + where.join(" AND ");
    //sql += " ORDER BY TreeId LIMIT 200";

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