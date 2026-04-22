//check if user is an admin
import { checkAdmin, logout } from "./adminAuth.js";
checkAdmin();
//logout button connection
const btn = document.getElementById("logoutBtn");
if (btn) {
    btn.addEventListener("click", logout);
}
const form = document.getElementById('createTree');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const treeData = {
        // Basic Info
        Species: document.getElementById('species').value,
        CommonName: document.getElementById('commonName').value,
        AGCT: document.getElementById('agct').value,
        ACProd: document.getElementById('acProd').value,
        NWIStatus: document.getElementById('nwiStatus').value,
        priority: document.getElementById('priority').checked ? 1:0,
        
        // Landform Preferences
        FloodPlainBottomLand: document.getElementById('floodPlain').checked,
        UplandMesic: document.getElementById('uplandMesic').checked,
        UplandDry: document.getElementById('uplandDry').checked,
        
        // Site Chemistry Preferences
        SoilAcidTol: document.getElementById('soilAcidTol').value || null,
        SoilAlkTol: document.getElementById('soilAlkainTol').value || null,
        SoilSaltTol: document.getElementById('saltTol').value || null,
        
        // Ecoregion
        EasternGreatLakeLowLands: document.getElementById('easternGreatLakeLowLands').checked,
        NorthernAlleghenyPlateau: document.getElementById('northernAlleghenyPlateau').checked,
        ErieDriftPlain: document.getElementById('erieDriftPlain').checked,
        NorthernCoastalZone: document.getElementById('northernCoastalZone').checked,
        NorthernPiedmont: document.getElementById('northernPiedmont').checked,
        RidgeAndValley: document.getElementById('ridgeAndValley').checked,
        AtlanticCoastalPineBarrens: document.getElementById('atlanticCoastalPineBarrens').checked,
        NortheasternHighlands: document.getElementById('northeasternHighlands').checked,
        NorthCentralAppalachian: document.getElementById('northCentralAppalachian').checked,
        
        // SAF Forest Type Group
        AspenBirch: document.getElementById('aspenBirch').checked,
        ElmAshCottonwood: document.getElementById('elmAshCottonwood').checked,
        LoblollyShortleafPine: document.getElementById('loblollyShortleafPine').checked,
        MapleBeechBirch: document.getElementById('mapleBeechBirch').checked,
        OakHickory: document.getElementById('oakHickory').checked,
        SpruceFir: document.getElementById('spruceFir').checked,
        WhiteRedJackPine: document.getElementById('whiteRedJackPine').checked,
        
        // Species Characteristics
        LifeSpan: parseInt(document.getElementById('lifeSpan').value) || null,
        TreeHeight: parseInt(document.getElementById('treeHeight').value) || null,
        CanopySpread: parseInt(document.getElementById('canopySpread').value) || null,
        GrowthRate: document.getElementById('growthrate').value || null,
        ShadeTol: document.getElementById('shadTol').value || null,
        
        // Economic Value
        Edible: document.getElementById('edible').checked,
        Lumber: document.getElementById('lumber').checked,
        FuelWood: document.getElementById('fuelWood').checked,
        
        // Ecological Value
        KnownInteractions: parseInt(document.getElementById('knownInteractions').value) || null,
        AttractsPollinators: document.getElementById('attractsPollinators').checked,
        AttractsBirds: document.getElementById('attractsBirds').checked,
        
        // Planting Considerations
        RecomendedForWindbreak: document.getElementById('recommendedForWindbreak').checked,
        DeerResistance: document.getElementById('deerResistance').value || null,
        PestAndPathogenSusceptibility: document.getElementById('pestAndPathogenSusceptibility').value || null
    };

    try {
        const response = await fetch('http://localhost:3000/api/admin/createFullTree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(treeData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(`Tree added!`);
            window.location.href = 'admin.html';
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = `Error: ${error.message}`;
    }
});