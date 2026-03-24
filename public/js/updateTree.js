const params = new URLSearchParams(window.location.search);
const treeId = params.get('id');
const messageDiv = document.getElementById('message');

async function LoadTreeData(){
    try{
        const response = await fetch(`/api/admin/getTree/${treeId}`);
        const data = await response.json();
        console.log(data);

        const tree = data.tree[0];
        const landPref = data.landformPref[0];
        const siteChemPref = data.siteChemPref[0];
        const ecoreg = data.ecoregion[0];
        const forestType = data.safforestTypeGroup[0];
        const speciesChar = data.speciesCharacteristics[0];
        const econVal = data.economicValue[0];
        const ecolVal = data.ecologicVal[0];
        const plantCons = data.plantingConsiderations[0];

        //loading basic info
        if(tree.species != null){
            document.getElementById('species').value = tree.species;
        }
        else{
            document.getElementById('species').value = '';
        }
        if(tree.CommonName != null){
            document.getElementById('CommonName').value = tree.CommonName;
        }
        else{
            document.getElementById('CommonName').value = '';
        }
        if(tree.AGCT != null){
            document.getElementById('agct').value = tree.AGCT;
        }
        else{
            document.getElementById('agct').value = '';
        }
        if(tree.ACProd != null){
            document.getElementById('acProd').value = tree.ACProd;
        }
        else{
            document.getElementById('acProd').value = '';
        }
        if(tree.NWIStatus != null){
            document.getElementById('nwiStatus').value = tree.NWIStatus;
        }
        else{
            document.getElementById('nwiStatus').value = '';
        }
// Land form Preferences
        document.getElementById('floodPlain').checked = landPref.FloodPlainBottomLand === 1;
        document.getElementById('uplandMesic').checked = landPref.UplandMesic === 1;
        document.getElementById('uplandDry').checked = landPref.UplandDry === 1;
//Site Chemistry Preference
        if(siteChemPref.SoilAcidTol != null){
            document.getElementById('soilAcidTol').value = siteChemPref.SoilAcidTol;
        }
        else{
            document.getElementById('soilAcidTol').value = '';
        }
        if(siteChemPref.SoilAlkTol != null){
            document.getElementById('soilAlkainTol').value = siteChemPref.SoilAlkTol
        }
        else{
            document.getElementById('soilAlkainTol').value = '';
        }
        if(siteChemPref.SoilSaltTol != null){
            document.getElementById('saltTol').value = siteChemPref.SoilSaltTol
        }
        else{
            document.getElementById('saltTol').value = '';
        }
//Ecoregion
    document.getElementById('easternGreatLakeLowLands').checked = ecoreg.EasternGreatLakeLowLands === 1;    
    document.getElementById('northernAlleghenyPlateau').checked = ecoreg.NorthernAlleghenyPlateau === 1;  
    document.getElementById('erieDriftPlain').checked = ecoreg.ErieDriftPlain === 1;    
    document.getElementById('northernCoastalZone').checked = ecoreg.NorthernCoastalZone === 1;
    document.getElementById('northernPiedmont').checked = ecoreg.NorthernPiedmont === 1;    
    document.getElementById('ridgeAndValley').checked = ecoreg.RidgeAndValley === 1;  
    document.getElementById('atlanticCoastalPineBarrens').checked = ecoreg.AtlanticCoastalPineBarrens === 1;    
    document.getElementById('northeasternHighlands').checked = ecoreg.NortheasternHighlands === 1;
    document.getElementById('northCentralAppalachian').checked = ecoreg.NorthCentralAppalachian === 1;
//SAF Forest Type Group
    document.getElementById('aspenBirch').checked = forestType.AspenBirch === 1;    
    document.getElementById('elmAshCottonwood').checked = forestType.ElmAshCottonwood === 1;  
    document.getElementById('loblollyShortleafPine').checked = forestType.LoblollyShortleafPine === 1;    
    document.getElementById('mapleBeechBirch').checked = forestType.MapleBeechBirch === 1;
    document.getElementById('oakHickory').checked = forestType.OakHickory === 1;    
    document.getElementById('spruceFir').checked = forestType.SpruceFir === 1;  
    document.getElementById('whiteRedJackPine').checked = forestType.WhiteRedJackPine === 1; 
//species Characteristics
    if(speciesChar.LifeSpan != null){
        document.getElementById('lifeSpan').value = speciesChar.LifeSpan;
    }
    else{
        document.getElementById('lifeSpan').value = '';
    }
    if(speciesChar.TreeHeight != null){
        document.getElementById('treeHeight').value = speciesChar.TreeHeight;
    }
    else{
        document.getElementById('treeHeight').value = '';
    }
    if(speciesChar.CanopySpread != null){
        document.getElementById('canopySpread').value = speciesChar.CanopySpread;
    }
    else{
        document.getElementById('canopySpread').value = '';
    }
    if(speciesChar.GrowthRate != null){
        document.getElementById('growthrate').value = speciesChar.GrowthRate;
    }
    else{
        document.getElementById('growthrate').value = '';
    }
    if(speciesChar.ShadeTol != null){
        document.getElementById('shadTol').value = speciesChar.ShadeTol;
    }
    else{
        document.getElementById('shadTol').value = '';
    }
//Economic Value
    document.getElementById('edible').checked = econVal.Edible === 1;    
    document.getElementById('lumber').checked = econVal.Lumber === 1;  
    document.getElementById('fuelWood').checked = econVal.FuelWood === 1;
//Ecological Value
    if(ecolVal.KnownInteractions != null){
        document.getElementById('knownInteractions').value = ecolVal.KnownInteractions;
    }
    else{
        document.getElementById('knownInteractions').value = '';
    }
    document.getElementById('attractsPollinators').checked = ecolVal.AttractsPollinators === 1;  
    document.getElementById('attractsBirds').checked = ecolVal.AttractsBirds === 1;
//planting considerations
    document.getElementById('recommendedForWindbreak').checked = plantCons.RecomendedForWindbreak  === 1;
    if(plantCons.DeerResistance != null){
        document.getElementById('deerResistance').value = plantCons.DeerResistance;
    }
    else{
        document.getElementById('deerResistance').value = '';
    }
    if(plantCons.PestAndPathogenSusceptibility != null){
        document.getElementById('pestAndPathogenSusceptibility').value = plantCons.PestAndPathogenSusceptibility;
    }
    else{
        document.getElementById('pestAndPathogenSusceptibility').value = '';
    }
    }catch(error){
        messageDiv.style.color = 'red';
        messageDiv.textContent = `Error loading tree: ${error.message}`;
    }
}

document.getElementById('updateTree').addEventListener('submit', async function(event) {
    event.preventDefault();

    const treeData = {
//Basic Info
        species: document.getElementById('species').value,
        commonName: document.getElementById('CommonName').value,
        AGCT: document.getElementById('agct').value,
        ACProd: document.getElementById('acProd').value,
        NWIStatus: document.getElementById('nwiStatus').value,
//Landform Preferences
        FloodPlainBottomLand: document.getElementById('floodPlain').checked,
        UplandMesic: document.getElementById('uplandMesic').checked,
        UplandDry: document.getElementById('uplandDry').checked,
//Site Chemistry
        SoilAcidTol: document.getElementById('soilAcidTol').value || null,
        SoilAlkTol: document.getElementById('soilAlkainTol').value || null,
        SoilSaltTol: document.getElementById('saltTol').value || null,
//Ecoregion
        EasternGreatLakeLowLands: document.getElementById('easternGreatLakeLowLands').checked,
        NorthernAlleghenyPlateau: document.getElementById('northernAlleghenyPlateau').checked,
        ErieDriftPlain: document.getElementById('erieDriftPlain').checked,
        NorthernCoastalZone: document.getElementById('northernCoastalZone').checked,
        NorthernPiedmont: document.getElementById('northernPiedmont').checked,
        RidgeAndValley: document.getElementById('ridgeAndValley').checked,
        AtlanticCoastalPineBarrens: document.getElementById('atlanticCoastalPineBarrens').checked,
        NortheasternHighlands: document.getElementById('northeasternHighlands').checked,
        NorthCentralAppalachian: document.getElementById('northCentralAppalachian').checked,
//SAF Forest Type Group
        AspenBirch: document.getElementById('aspenBirch').checked,
        ElmAshCottonwood: document.getElementById('elmAshCottonwood').checked,
        LoblollyShortleafPine: document.getElementById('loblollyShortleafPine').checked,
        MapleBeechBirch: document.getElementById('mapleBeechBirch').checked,
        OakHickory: document.getElementById('oakHickory').checked,
        SpruceFir: document.getElementById('spruceFir').checked,
        WhiteRedJackPine: document.getElementById('whiteRedJackPine').checked,

//Species Characteristics
        LifeSpan: parseInt(document.getElementById('lifeSpan').value) || null,
        TreeHeight: parseInt(document.getElementById('treeHeight').value) || null,
        CanopySpread: parseInt(document.getElementById('canopySpread').value) || null,
        GrowthRate: document.getElementById('growthrate').value || null,
        ShadeTol: document.getElementById('shadTol').value || null,
//Economic Value
        Edible: document.getElementById('edible').checked,
        Lumber: document.getElementById('lumber').checked,
        FuelWood: document.getElementById('fuelWood').checked,
//Ecological Value
        KnownInteractions: parseInt(document.getElementById('knownInteractions').value) || null,
        AttractsPollinators: document.getElementById('attractsPollinators').checked,
        AttractsBirds: document.getElementById('attractsBirds').checked,
//Planting Considerations
        RecomendedForWindbreak: document.getElementById('recommendedForWindbreak').checked,
        DeerResistance: document.getElementById('deerResistance').value || null,
        PestAndPathogenSusceptibility: document.getElementById('pestAndPathogenSusceptibility').value || null
    };

    try {
        // Update each table
        await Promise.all([
            fetch(`/api/admin/updateTree/${treeId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(treeData) }),
            fetch(`/api/admin/updateLandformPref/${treeId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(treeData) }),
            fetch(`/api/admin/updateSiteChemPref/${treeId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(treeData) }),
            fetch(`/api/admin/updateEcoregion/${treeId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(treeData) }),
            fetch(`/api/admin/updateSAFForestTypeGroup/${treeId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(treeData) }),
            fetch(`/api/admin/updateSpeciesCharacteristics/${treeId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(treeData) }),
            fetch(`/api/admin/updateEconomicValue/${treeId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(treeData) }),
            fetch(`/api/admin/updateEcologicVal/${treeId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(treeData) }),
            fetch(`/api/admin/updatePlantingConsiderations/${treeId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(treeData) })
        ]);

        alert('Tree updated!');
        window.location.href = 'admin.html';

    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = `Error updating tree: ${error.message}`;
    }
});

LoadTreeData();