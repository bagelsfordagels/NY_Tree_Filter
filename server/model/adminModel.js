const adminPool = require("../adminDB");

//get functions
async function getAllTrees(){ 
    let sql = 'SELECT * FROM Trees';
    return await adminPool.query(sql);
}

async function getTree(TreeId){
    const [tree] = await adminPool.query('SELECT * FROM Trees WHERE TreeId = ?', [TreeId]);
    const [landformPref] = await adminPool.query('SELECT * FROM LandformPref WHERE TreeId = ?', [TreeId]);
    const [siteChemPref] = await adminPool.query('SELECT * FROM SiteChemPref WHERE TreeId = ?', [TreeId]);
    const [ecoregion] = await adminPool.query('SELECT * FROM Ecoregion WHERE TreeId = ?', [TreeId]);
    const [safforestTypeGroup] = await adminPool.query('SELECT * FROM SAFForestTypeGroup WHERE TreeId = ?', [TreeId]);
    const [speciesCharacteristics] = await adminPool.query('SELECT * FROM SpeciesCharacteristics WHERE TreeId = ?', [TreeId]);
    const [economicValue] = await adminPool.query('SELECT * FROM EconomicValue WHERE TreeId = ?', [TreeId]);
    const [ecologicVal] = await adminPool.query('SELECT * FROM EcologicalValue WHERE TreeId = ?', [TreeId]);
    const [plantingConsiderations] = await adminPool.query('SELECT * FROM PlantingConsiderations WHERE TreeId = ?', [TreeId]);
    return { tree, landformPref, siteChemPref, ecoregion, safforestTypeGroup, speciesCharacteristics, economicValue, ecologicVal, plantingConsiderations };
}

//Creating a tree
async function createFullTree(treeData) {
    const connection = await adminPool.getConnection();
    try{
        await connection.beginTransaction();
        const [result] = await createTree(connection, treeData);
        const treeId = result.insertId;
        await createLandformPref(connection, treeId, treeData);
        await createSiteChemPref(connection, treeId, treeData);
        await createEcoregion(connection, treeId, treeData);
        await createSAFForestTypeGroup(connection, treeId, treeData);
        await createSpeciesCharacteristics(connection, treeId, treeData);
        await createEconomicValue(connection, treeId, treeData);
        await createEcologicVal(connection, treeId, treeData);
        await createPlantingConsiderations(connection, treeId, treeData);
        await connection.commit();
        return { success: true, treeId };
    }catch (err) {
        await connection.rollback();
        console.error("Error creating tree:", err);
        throw err;
    }finally {
        connection.release();
    }
}

async function createTree(connection, treeData) {
    let sql = 'INSERT INTO Trees (Species, CommonName, AGCT, ACProd, NWIStatus, priority) VALUES (?, ?, ?, ?, ?,?)';
    let values = [treeData.Species, treeData.CommonName, treeData.AGCT, treeData.ACProd, treeData.NWIStatus,treeData.priority];
    return await connection.query(sql, values);
}

async function createLandformPref(connection, treeId, treeData){
    let sql = 'INSERT INTO LandformPref (TreeId, FloodPlainBottomLand, UplandMesic, UplandDry) VALUES (?, ?, ?, ?)';
    let values = [treeId, treeData.FloodPlainBottomLand, treeData.UplandMesic, treeData.UplandDry];
    return await connection.query(sql, values);
}

async function createSiteChemPref(connection, treeId, treeData){
    let sql = 'INSERT INTO SiteChemPref (TreeId, SoilAcidTol, SoilAlkTol, SoilSaltTol) VALUES (?, ?, ?, ?)';
    let values = [treeId, treeData.SoilAcidTol, treeData.SoilAlkTol, treeData.SoilSaltTol];
    return await connection.query(sql, values);
}

async function createEcoregion(connection, treeId, treeData){
    let sql = 'INSERT INTO Ecoregion (TreeId, EasternGreatLakeLowLands, NorthernAlleghenyPlateau, ErieDriftPlain, NorthernCoastalZone, NorthernPiedmont, RidgeAndValley, AtlanticCoastalPineBarrens, NortheasternHighlands, NorthCentralAppalachian) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    let values = [treeId, treeData.EasternGreatLakeLowLands, treeData.NorthernAlleghenyPlateau, treeData.ErieDriftPlain, treeData.NorthernCoastalZone, treeData.NorthernPiedmont, treeData.RidgeAndValley, treeData.AtlanticCoastalPineBarrens, treeData.NortheasternHighlands, treeData.NorthCentralAppalachian];
    return await connection.query(sql, values);
}

async function createSAFForestTypeGroup(connection, treeId, treeData) {
    let sql = 'INSERT INTO SAFForestTypeGroup (TreeId, AspenBirch, ElmAshCottonwood, LoblollyShortleafPine, MapleBeechBirch, OakHickory, SpruceFir, WhiteRedJackPine) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    let values = [treeId, treeData.AspenBirch, treeData.ElmAshCottonwood, treeData.LoblollyShortleafPine, treeData.MapleBeechBirch, treeData.OakHickory, treeData.SpruceFir, treeData.WhiteRedJackPine];
    return await connection.query(sql, values);
}

async function createSpeciesCharacteristics(connection, treeId, treeData) {
    let sql = 'INSERT INTO SpeciesCharacteristics (TreeId, LifeSpan, TreeHeight, CanopySpread, GrowthRate, ShadeTol) VALUES (?, ?, ?, ?, ?, ?)';
    let values = [treeId, treeData.LifeSpan, treeData.TreeHeight, treeData.CanopySpread, treeData.GrowthRate, treeData.ShadeTol];
    return await connection.query(sql, values);
}

async function createEconomicValue(connection, treeId, treeData) {
    let sql = 'INSERT INTO EconomicValue (TreeId, Edible, Lumber, FuelWood) VALUES (?, ?, ?, ?)';
    let values = [treeId, treeData.Edible, treeData.Lumber, treeData.FuelWood];
    return await connection.query(sql, values);
}

async function createEcologicVal(connection, treeId, treeData){
    let sql = 'INSERT INTO EcologicalValue (TreeId, KnownInteractions, AttractsPollinators, AttractsBirds) VALUES (?, ?, ?, ?)';
    let values = [treeId, treeData.KnownInteractions, treeData.AttractsPollinators, treeData.AttractsBirds];
    return await connection.query(sql, values);
}
async function createPlantingConsiderations(connection, treeId, treeData) {
    let sql = 'INSERT INTO PlantingConsiderations (TreeId, RecomendedForWindbreak, DeerResistance, PestAndPathogenSusceptibility) VALUES (?, ?, ?, ?)';
    let values = [treeId, treeData.RecomendedForWindbreak, treeData.DeerResistance, treeData.PestAndPathogenSusceptibility];
    return await connection.query(sql, values);
}

//Removing a tree
async function removeFullTree(treeId) {
    const connection = await adminPool.getConnection();
    try{
        await connection.beginTransaction();
        await removeLandformPref(connection, treeId);
        await removeSiteChemPref(connection, treeId);
        await removeEcoregion(connection, treeId);
        await removeSAFForestTypeGroup(connection, treeId);
        await removeSpeciesCharacteristics(connection, treeId);
        await removeEconomicValue(connection, treeId);
        await removeEcologicVal(connection, treeId);
        await removePlantingConsiderations(connection, treeId);
        await removeTree(connection, treeId);
        await connection.commit();
        return { success: true, treeId };
    }catch (err) {
        await connection.rollback();
        console.error("Error removing tree:", err);
        throw err;
    }finally {
        connection.release();
    }
}

async function removeTree(connection, treeId) {
    let sql = 'DELETE FROM Trees WHERE TreeId = ?';
    let values = [treeId];
    return await connection.query(sql, values);
}
async function removeLandformPref(connection, treeId) {
    let sql = 'DELETE FROM LandformPref WHERE TreeId = ?';
    let values = [treeId];
    return await connection.query(sql, values);
}

async function removeSiteChemPref(connection, treeId) {
    let sql = 'DELETE FROM SiteChemPref WHERE TreeId = ?';
    let values = [treeId];
    return await connection.query(sql, values);
}

async function removeEcoregion(connection, treeId) {
    let sql = 'DELETE FROM Ecoregion WHERE TreeId = ?';
    let values = [treeId];
    return await connection.query(sql, values);
}

async function removeSAFForestTypeGroup(connection, treeId) {
    let sql = 'DELETE FROM SAFForestTypeGroup WHERE TreeId = ?';
    let values = [treeId];
    return await connection.query(sql, values);
}

async function removeSpeciesCharacteristics(connection, treeId) {
    let sql = 'DELETE FROM SpeciesCharacteristics WHERE TreeId = ?';
    let values = [treeId];
    return await connection.query(sql, values);
}

async function removeEconomicValue(connection, treeId) {
    let sql = 'DELETE FROM EconomicValue WHERE TreeId = ?';
    let values = [treeId];
    return await connection.query(sql, values);
}

async function removeEcologicVal(connection, treeId) {
    let sql = 'DELETE FROM EcologicalValue WHERE TreeId = ?';
    let values = [treeId];
    return await connection.query(sql, values);
}

async function removePlantingConsiderations(connection, treeId) {
    let sql = 'DELETE FROM PlantingConsiderations WHERE TreeId = ?';
    let values = [treeId];
    return await connection.query(sql, values);
}

//Update tree
async function updateTree(treeId, treeData) {
   const update = [];
   const values = [];

   if(treeData.species !== undefined){
    update.push('Species = ?');
    values.push(treeData.species);
   }
   if(treeData.commonName !== undefined){
    update.push('CommonName = ?');
    values.push(treeData.commonName);
   }
   if(treeData.AGCT !== undefined){
    update.push('AGCT = ?');
    values.push(treeData.AGCT);
   }
   if(treeData.ACProd !== undefined){
    update.push('ACProd = ?');
    values.push(treeData.ACProd);
   }
   if(treeData.NWIStatus !== undefined){
    update.push('NWIStatus = ?');
    values.push(treeData.NWIStatus);
   }
   if(treeData.priority !== undefined){
    update.push('priority = ?');
    values.push(treeData.priority);
   }
   let sql = `UPDATE Trees SET ${update.join(', ')} WHERE TreeId = ?`;
   values.push(treeId);
   return await adminPool.query(sql, values);
}

async function updateLandformPref(treeId, treeData) {
    const update = [];
    const values = [];

    if(treeData.FloodPlainBottomLand !== undefined){
        update.push('FloodPlainBottomLand = ?');
        values.push(treeData.FloodPlainBottomLand);
    }
    if(treeData.UplandMesic !== undefined){
    update.push('UplandMesic = ?');
    values.push(treeData.UplandMesic);
    }
    if(treeData.UplandDry !== undefined){
        update.push('UplandDry = ?');
        values.push(treeData.UplandDry);
    }
    let sql = `UPDATE LandformPref SET ${update.join(', ')} WHERE TreeId = ?`;
    values.push(treeId);
    return await adminPool.query(sql, values);
}

async function updateSiteChemPref(treeId, treeData) {
    const update = [];
    const values = [];

    if(treeData.SoilAcidTol !== undefined){
        update.push('SoilAcidTol = ?');
        values.push(treeData.SoilAcidTol);
    }
    if(treeData.SoilAlkTol !== undefined){
        update.push('SoilAlkTol = ?');
        values.push(treeData.SoilAlkTol);
    }
    if(treeData.SoilSaltTol !== undefined){
        update.push('SoilSaltTol = ?');
        values.push(treeData.SoilSaltTol);
    }
    let sql = `UPDATE SiteChemPref SET ${update.join(', ')} WHERE TreeId = ?`;
    values.push(treeId);
    return await adminPool.query(sql, values);
}

async function updateEcoregion(treeId, treeData) {
    const update = [];
    const values = [];

    if(treeData.EasternGreatLakeLowLands !== undefined){
        update.push('EasternGreatLakeLowLands = ?');
        values.push(treeData.EasternGreatLakeLowLands);
    }
    if(treeData.NorthernAlleghenyPlateau !== undefined){
        update.push('NorthernAlleghenyPlateau = ?');
        values.push(treeData.NorthernAlleghenyPlateau);
    }
    if(treeData.ErieDriftPlain !== undefined){
        update.push('ErieDriftPlain = ?');
        values.push(treeData.ErieDriftPlain);
    }
    if(treeData.NorthernCoastalZone !== undefined){
        update.push('NorthernCoastalZone = ?');
        values.push(treeData.NorthernCoastalZone);
    }
    if(treeData.NorthernPiedmont !== undefined){
        update.push('NorthernPiedmont = ?');
        values.push(treeData.NorthernPiedmont);
    }
    if(treeData.RidgeAndValley !== undefined){
        update.push('RidgeAndValley = ?');
        values.push(treeData.RidgeAndValley);
    }
    if(treeData.AtlanticCoastalPineBarrens !== undefined){
        update.push('AtlanticCoastalPineBarrens = ?');
        values.push(treeData.AtlanticCoastalPineBarrens);
    }
    if(treeData.NortheasternHighlands !== undefined){
        update.push('NortheasternHighlands = ?');
        values.push(treeData.NortheasternHighlands);
    }
    if(treeData.NorthCentralAppalachian !== undefined){
        update.push('NorthCentralAppalachian = ?');
        values.push(treeData.NorthCentralAppalachian);
    }
    let sql = `UPDATE Ecoregion SET ${update.join(', ')} WHERE TreeId = ?`;
    values.push(treeId);
    return await adminPool.query(sql, values);
}

async function updateSAFForestTypeGroup(treeId, treeData) {
    const update = [];
    const values = [];

    if(treeData.AspenBirch !== undefined){
        update.push('AspenBirch = ?');
        values.push(treeData.AspenBirch);
    }
    if(treeData.ElmAshCottonwood !== undefined){
        update.push('ElmAshCottonwood = ?');
        values.push(treeData.ElmAshCottonwood);
    }
    if(treeData.LoblollyShortleafPine !== undefined){
        update.push('LoblollyShortleafPine = ?');
        values.push(treeData.LoblollyShortleafPine);
    }
    if(treeData.MapleBeechBirch !== undefined){
        update.push('MapleBeechBirch = ?');
        values.push(treeData.MapleBeechBirch);
    }
    if(treeData.OakHickory !== undefined){
        update.push('OakHickory = ?');
        values.push(treeData.OakHickory);
    }
    if(treeData.SpruceFir !== undefined){
        update.push('SpruceFir = ?');
        values.push(treeData.SpruceFir);
    }
    if(treeData.WhiteRedJackPine !== undefined){
        update.push('WhiteRedJackPine = ?');
        values.push(treeData.WhiteRedJackPine);
    }
    let sql = `UPDATE SAFForestTypeGroup SET ${update.join(', ')} WHERE TreeId = ?`;
    values.push(treeId);
    return await adminPool.query(sql, values);
}

async function updateSpeciesCharacteristics(treeId, treeData) {
    const update = [];
    const values = [];

    if(treeData.LifeSpan !== undefined){
        update.push('LifeSpan = ?');
        values.push(treeData.LifeSpan);
    }
    if(treeData.TreeHeight !== undefined){
        update.push('TreeHeight = ?');
        values.push(treeData.TreeHeight);
    }
    if(treeData.CanopySpread !== undefined){
        update.push('CanopySpread = ?');
        values.push(treeData.CanopySpread);
    }
    if(treeData.GrowthRate !== undefined){
        update.push('GrowthRate = ?');
        values.push(treeData.GrowthRate);
    }
    if(treeData.ShadeTol !== undefined){
        update.push('ShadeTol = ?');
        values.push(treeData.ShadeTol);
    }
    let sql = `UPDATE SpeciesCharacteristics SET ${update.join(', ')} WHERE TreeId = ?`;
    values.push(treeId);
    return await adminPool.query(sql, values);
}

async function updateEconomicValue(treeId, treeData) {
    const update = [];
    const values = [];

    if(treeData.Edible !== undefined){
        update.push('Edible = ?');
        values.push(treeData.Edible);
    }
    if(treeData.Lumber !== undefined){
        update.push('Lumber = ?');
        values.push(treeData.Lumber);
    }
    if(treeData.FuelWood !== undefined){
        update.push('FuelWood = ?');
        values.push(treeData.FuelWood);
    }
    let sql = `UPDATE EconomicValue SET ${update.join(', ')} WHERE TreeId = ?`;
    values.push(treeId);
    return await adminPool.query(sql, values);
}

async function updateEcologicVal(treeId, treeData) {
    const update = [];
    const values = [];

    if(treeData.KnownInteractions !== undefined){
        update.push('KnownInteractions = ?');
        values.push(treeData.KnownInteractions);
    }
    if(treeData.AttractsPollinators !== undefined){
        update.push('AttractsPollinators = ?');
        values.push(treeData.AttractsPollinators);
    }
    if(treeData.AttractsBirds != undefined){
        update.push('AttractsBirds = ?');
        values.push(treeData.AttractsBirds);
    }
    let sql = `UPDATE EcologicalValue SET ${update.join(', ')} WHERE TreeId = ?`;
    values.push(treeId);
    return await adminPool.query(sql, values);
}

async function updatePlantingConsiderations(treeId, treeData) {
    const update = [];
    const values = [];

    if(treeData.RecomendedForWindbreak !== undefined){
        update.push('RecomendedForWindbreak = ?');
        values.push(treeData.RecomendedForWindbreak);
    }
    if(treeData.DeerResistance !== undefined){
        update.push('DeerResistance = ?');
        values.push(treeData.DeerResistance);
    }
    if(treeData.PestAndPathogenSusceptibility !== undefined){
        update.push('PestAndPathogenSusceptibility = ?');
        values.push(treeData.PestAndPathogenSusceptibility);
    }
    let sql = `UPDATE PlantingConsiderations SET ${update.join(', ')} WHERE TreeId = ?`;
    values.push(treeId);
    return await adminPool.query(sql, values);
}

module.exports = {getAllTrees, getTree, createFullTree, removeFullTree, updateTree, updateLandformPref, updateSiteChemPref, updateEcoregion, updateSAFForestTypeGroup, updateSpeciesCharacteristics, updateEconomicValue, updateEcologicVal, updatePlantingConsiderations};