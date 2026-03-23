function getVal(id) {
    return document.getElementById(id).value.trim();
    return el ? el.value.trim() : "";
}

let lifeSlider;
let heightSlider;
let canopySlider;

const filters = [
        { id: "filterSpecies", param: "species" },
        { id: "filterCommon", param: "CommonName" },
        { id: "filterAGCT", param: "agct" },
        { id: "filterACProd", param: "acprod" },
        { id: "filterNWI", param: "nwistatus" },

        { id: "filterFloodBottom", param: "floodplainbottomland" },
        { id: "filterUplandMesic", param: "uplandmesic" },
        { id: "filterUplandDry", param: "uplanddry" },

        { id: "filterSoilAcidTol", param: "soilacidtol" },
        { id: "filterSoilAlkTol", param: "soilalktol" },
        { id: "filterSoilSaltTol", param: "soilsalttol" },

        { id: "filterEGLL", param: "easterngreatlakelowlands"},
        { id: "filterNAP", param: "northernalleghenyplateau"},
        { id: "filterEDP", param: "eriedriftplain"},
        { id: "filterNCZ", param: "northercoastalzone"},
        { id: "filterNP", param: "northernpiedmont"},
        { id: "filterRV", param: "ridgeandvalley"},
        { id: "filterACPB", param: "atlanticcoastalpinebarrens"},
        { id: "filterNH", param: "northeasternhighlands"},
        { id: "filterNCA", param: "northcentralappalachian"},

        { id: "filterAspenBirch", param: "aspenbirch"},
        { id: "filterElmAshCottonwood", param: "elmashcottonwood"},
        { id: "filterLobLolly", param: "loblollyshortleafpine"},
        { id: "filterMapleBeechBirch", param: "maplebeechbirch"},
        { id: "filterOakHickory", param: "oakhickory"},
        { id: "filterSpruceFir", param: "sprucefir"},
        { id: "filterWhiteRedJackPine", param: "whiteredjackpine"},

        { id: "filterGrowthRate", param: "growthrate"},
        { id: "filterShadeTolerance", param: "shadetol"}



];

const hiddenGroups = {
    climate: false,
    prod: false,
    wetland: false,
    landform: false,
    soil: false,
    ecoregion: false,
    forestType: false,
    characteristics: false
};
    



function buildParams() {
    const params = new URLSearchParams();

    filters.forEach(function(f){
        const val = getVal(f.id);
        if(val) params.set(f.param, val);

    });

    if (lifeSlider && lifeSlider.noUiSlider) {
        const values = lifeSlider.noUiSlider.get();
        const min = Math.round(values[0]);
        const max = Math.round(values[1]);

        if (min !== 0 || max !== 300) {
            params.set("lifespanMin", min);
            params.set("lifespanMax", max);
        }
    }

    if (heightSlider && heightSlider.noUiSlider) {
        const values = heightSlider.noUiSlider.get();
        const min = Math.round(values[0]);
        const max = Math.round(values[1]);

        if (min !== 0 || max !== 100) {
            params.set("treeheightMin", min);
            params.set("treeheightMax", max);
        }
    }

    if (canopySlider && canopySlider.noUiSlider) {
        const values = canopySlider.noUiSlider.get();
        const min = Math.round(values[0]);
        const max = Math.round(values[1]);

        if (min !== 0 || max !== 100) {
            params.set("canopyspreadMin", min);
            params.set("canopyspreadMax", max);
        }
    }
    

    return params;
}

async function populateDropdown(selectId, table, column) {
    const res = await fetch(`/api/distinct/${table}/${column}`);
    const values = await res.json();

    if (!Array.isArray(values)) return;

    const select = document.getElementById(selectId);

    values.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
    });
}


async function fetchAndRenderTrees() {
    const params = buildParams();
    const res = await fetch(`/api/filter?${params.toString()}`);
    const rows = await res.json();

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    rows.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-group="general">${r.species ?? ""}</td>
            <td data-group="general">${r.CommonName ?? ""}</td>
            <td data-group="climate">${r.AGCT ?? ""}</td>
            <td data-group="prod">${r.ACProd ?? ""}</td>
            <td data-group="wetland">${r.NWIStatus ?? ""}</td>

            <td data-group="landform">${booleanToYn(r.FloodPlainBottomLand)}</td>
            <td data-group="landform">${booleanToYn(r.UplandMesic)}</td>
            <td data-group="landform">${booleanToYn(r.UplandDry)}</td>

            <td data-group="soil">${r.SoilAcidTol ?? ""}</td>
            <td data-group="soil">${r.SoilAlkTol ?? ""}</td>
            <td data-group="soil">${r.SoilSaltTol ?? ""}</td>

            <td data-group="ecoregion">${booleanToYn(r.EasternGreatLakeLowLands)}</td>
            <td data-group="ecoregion">${booleanToYn(r.NorthernAlleghenyPlateau)}</td>
            <td data-group="ecoregion">${booleanToYn(r.ErieDriftPlain)}</td>
            <td data-group="ecoregion">${booleanToYn(r.NorthernCoastalZone)}</td>
            <td data-group="ecoregion">${booleanToYn(r.NorthernPiedmont)}</td>
            <td data-group="ecoregion">${booleanToYn(r.RidgeAndValley)}</td>
            <td data-group="ecoregion">${booleanToYn(r.AtlanticCoastalPineBarrens)}</td>
            <td data-group="ecoregion">${booleanToYn(r.NortheasternHighlands)}</td>
            <td data-group="ecoregion">${booleanToYn(r.NorthCentralAppalachian)}</td> 
            
            <td data-group="forestType">${booleanToYn(r.AspenBirch)}</td>
            <td data-group="forestType">${booleanToYn(r.ElmAshCottonwood)}</td>
            <td data-group="forestType">${booleanToYn(r.LoblollyShortleafPine)}</td>
            <td data-group="forestType">${booleanToYn(r.MapleBeechBirch)}</td>
            <td data-group="forestType">${booleanToYn(r.OakHickory)}</td>
            <td data-group="forestType">${booleanToYn(r.SpruceFir)}</td>
            <td data-group="forestType">${booleanToYn(r.WhiteRedJackPine)}</td> 

            <td data-group="characteristics">${r.LifeSpan ?? ""}</td>
            <td data-group="characteristics">${r.TreeHeight ?? ""}</td>
            <td data-group="characteristics">${r.CanopySpread ?? ""}</td>
            <td data-group="characteristics">${r.GrowthRate ?? ""}</td>
            <td data-group="characteristics">${r.ShadeTol ?? ""}</td>
            
        `;
        tbody.appendChild(tr);
        applyHiddenGroups();
    });
}

function booleanToYn(val){
    if (val == 1) return "Yes";
    if (val == 0) return "No";
    return "";
}

function clearFilters() {
    filters.forEach(function(f){
        document.getElementById(f.id).value = "";
    });
}

function toggleGroup(group) {
  hiddenGroups[group] = !hiddenGroups[group];

  const elements = document.querySelectorAll(`[data-group="${group}"]`);
  elements.forEach(function(el) {
    el.style.display = hiddenGroups[group] ? "none" : "";
  });
}

function applyHiddenGroups() {
  for (const group in hiddenGroups) {
    if (hiddenGroups[group]) {
      const elements = document.querySelectorAll(`[data-group="${group}"]`);
      elements.forEach(function(el) {
        el.style.display = "none";
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {

    lifeSlider = document.getElementById('lifespanSlider');
    heightSlider = document.getElementById('heightSlider');
    canopySlider = document.getElementById('canopySlider');

    if (lifeSlider) {
        noUiSlider.create(lifeSlider, {
            start: [0, 300],
            connect: true,
            range: { min: 0, max: 300 },
            step: 1
        });

        const lifeMinVal = document.getElementById("lifeMinVal");
        const lifeMaxVal = document.getElementById("lifeMaxVal");


        lifeSlider.noUiSlider.on('update', (values) => {
            lifeMinVal.textContent = Math.round(values[0]);
            lifeMaxVal.textContent = Math.round(values[1]);
        });
    }

    if (heightSlider) {
        noUiSlider.create(heightSlider, {
            start: [0, 100],
            connect: true,
            range: { min: 0, max: 100 },
            step: 1
        });

        const heightMinVal = document.getElementById("heightMinVal");
        const heightMaxVal = document.getElementById("heightMaxVal");

        heightSlider.noUiSlider.on('update', (values) => {
            heightMinVal.textContent = Math.round(values[0]);
            heightMaxVal.textContent = Math.round(values[1]);
        });
    }

    if (canopySlider) {
        noUiSlider.create(canopySlider, {
            start: [0, 100],
            connect: true,
            range: { min: 0, max: 100 },
            step: 1
        });

        const canopyMinVal = document.getElementById("canopyMinVal");
        const canopyMaxVal = document.getElementById("canopyMaxVal");

        canopySlider.noUiSlider.on('update', (values) => {
            canopyMinVal.textContent = Math.round(values[0]);
            canopyMaxVal.textContent = Math.round(values[1]);
        });
    }

    await populateDropdown("filterAGCT", "Trees", "AGCT");
    await populateDropdown("filterACProd", "Trees", "ACProd");
    await populateDropdown("filterSpecies", "Trees", "species");
    await populateDropdown("filterCommon", "Trees", "CommonName");
    await populateDropdown("filterNWI", "Trees","NWIStatus" );
    await populateDropdown("filterSoilAcidTol", "SiteChemPref", "SoilAcidTol");
    await populateDropdown("filterSoilAlkTol", "SiteChemPref", "SoilAlkTol");
    await populateDropdown("filterSoilSaltTol", "SiteChemPref", "SoilSaltTol");
    await populateDropdown("filterGrowthRate", "SpeciesCharacteristics", "GrowthRate");
    await populateDropdown("filterShadeTolerance", "SpeciesCharacteristics", "ShadeTol");

document
    .getElementById("applyFilters")
    .addEventListener("click", fetchAndRenderTrees);

document
    .getElementById("clearFilters")
    .addEventListener("click", () => {
      clearFilters();
      fetchAndRenderTrees();
    });

    fetchAndRenderTrees();
});