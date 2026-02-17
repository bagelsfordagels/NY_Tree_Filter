const Express = require('express');
const admin = require('../model/admin');
const router = Express.Router();

router

.get('/getAllTrees', async (req, res) => {
    try{
        const [trees] = await admin.getAllTrees();
        res.status(200).json(trees);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.get('/getTree/:treeId', async (req, res) => {
    console.log(req.params.treeId);
    try{
        const tree = await admin.getTree(req.params.treeId);
        res.status(200).json(tree);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.post('/createFullTree', async (req, res) => {
    try{
        const treeId = await admin.createFullTree(req.body);
        res.status(201).json({treeId});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.delete('/removeFullTree/:treeId', async (req, res) => {
    try{
        await admin.removeFullTree(req.params.treeId);
        res.status(200).json({Success: true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.put('/updateTree/:treeId', async (req, res) => {
    try{
        console.log(req.body);
        await admin.updateTree(req.params.treeId, req.body);
        res.status(200).json({Success: true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.put('/updateLandformPref/:treeId', async (req, res) => {
    try{
        await admin.updateLandformPref(req.params.treeId, req.body);
        res.status(200).json({Success: true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.put('/updateSiteChemPref/:treeId', async (req, res) => {
    try{
        await admin.updateSiteChemPref(req.params.treeId, req.body);
        res.status(200).json({Success: true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.put('/updateEcoregion/:treeId', async (req, res) => {
    try{
        await admin.updateEcoregion(req.params.treeId, req.body);
        res.status(200).json({Success: true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.put('/updateSAFForestTypeGroup/:treeId', async (req, res) => {
    try{
        await admin.updateSAFForestTypeGroup(req.params.treeId, req.body);
        res.status(200).json({Success: true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.put('/updateSpeciesCharacteristics/:treeId', async (req, res) => {
    try{
        await admin.updateSpeciesCharacteristics(req.params.treeId, req.body);
        res.status(200).json({Success: true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.put('/updateEconomicValue/:treeId', async (req, res) => {
    try{
        await admin.updateEconomicValue(req.params.treeId, req.body);
        res.status(200).json({Success: true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.put('/updateEcologicVal/:treeId', async (req, res) => {
    try{
        await admin.updateEcologicVal(req.params.treeId, req.body);
        res.status(200).json({Success: true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

.put('/updatePlantingConsiderations/:treeId', async (req, res) => {
    try{
        await admin.updatePlantingConsiderations(req.params.treeId, req.body);
        res.status(200).json({Success: true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

module.exports = router;