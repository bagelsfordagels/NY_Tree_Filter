function getVal(id) {
    return document.getElementById(id).value.trim();
}

let lifeSlider;
let heightSlider;
let canopySlider;
let knownInteractionsSlider;
let currentRows = [];

const filters = [
        { id: "filterSpecies", param: "species" },
        { id: "filterCommon", param: "CommonName" },
        { id: "filterPriority", param: "priority" },
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
        { id: "filterNCZ", param: "northerncoastalzone"},
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
        { id: "filterShadeTolerance", param: "shadetol"},

        { id: "filterEdible", param: "edible"},
        { id: "filterLumber", param: "lumber"},
        { id: "filterFuelWood", param: "fuelwood"},

        { id: "filterPollinators", param: "attractspollinators"},
        { id: "filterBirds", param: "attractsbirds"},

        { id: "filterWindbreak", param: "recomendedforwindbreak"},
        { id: "filterDeer", param: "deerresistance"},
        { id: "filterPest", param: "pestandpathogensusceptibility"}

];

const hiddenGroups = {
    climate: true,
    prod: true,
    wetland: true,
    landform: true,
    soil: true,
    ecoregion: true,
    forestType: true,
    characteristics: true,
    economic: true,
    ecological: true,
    plantingConsiderations: true
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

    if (knownInteractionsSlider && knownInteractionsSlider.noUiSlider) {
        const values = knownInteractionsSlider.noUiSlider.get();
        const min = Math.round(values[0]);
        const max = Math.round(values[1]);

        if (min !== 0 || max !== 800) {
            params.set("knowninteractionsMin", min);
            params.set("knowninteractionsMax", max);
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

    currentRows = rows;

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    if (rows.length === 0) {
        const tr = document.createElement("tr");
        tr.classList.add("noResults");
        tr.innerHTML = `<td colspan="42">No results found</td>`;
        tbody.appendChild(tr);
        return;
    }

    rows.forEach(r => {
        const tr = document.createElement("tr");
        const marker = r.priority == 1 ? `<span class="priority-star">🟊</span>` : "";
        tr.innerHTML = `
            <td data-group="general">
                ${marker} ${r.species ?? ""}
            </td>
            <td data-group="general">
                ${marker} ${r.CommonName ?? ""} 
            </td>
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

            <td data-group="economic">${booleanToYn(r.Edible)}</td>
            <td data-group="economic">${booleanToYn(r.Lumber)}</td>
            <td data-group="economic">${booleanToYn(r.FuelWood)}</td> 

            <td data-group="ecological">${r.KnownInteractions ?? ""}</td>
            <td data-group="ecological">${booleanToYn(r.AttractsPollinators)}</td>
            <td data-group="ecological">${booleanToYn(r.AttractsBirds)}</td>
            
            <td data-group="plantingConsiderations">${booleanToYn(r.RecomendedForWindbreak)}</td>
            <td data-group="plantingConsiderations">${r.DeerResistance ?? ""}</td>
            <td data-group="plantingConsiderations">${r.PestAndPathogenSusceptibility ?? ""}</td>
        `;
        tbody.appendChild(tr);
        
    });
    applyHiddenGroups();
}

function buildFilterSummary() {
    const parts = [];

    // Dropdown filters — map filter id to a readable label
    const filterLabels = {
        filterSpecies:      "Species",
        filterCommon:       "Common Name",
        filterPriority:     "Priority",
        filterAGCT:         "Climate Tolerance",
        filterACProd:       "Commercial Production",
        filterNWI:          "Wetland Status",
        filterFloodBottom:  "Floodplain",
        filterUplandMesic:  "Upland Mesic",
        filterUplandDry:    "Upland Dry",
        filterSoilAcidTol:  "Soil Acidity",
        filterSoilAlkTol:   "Soil Alkalinity",
        filterSoilSaltTol:  "Soil Salt",
        filterEGLL:         "E. Great Lake Lowlands",
        filterNAP:          "N. Allegheny Plateau",
        filterEDP:          "Erie Drift Plain",
        filterNCZ:          "N. Coastal Zone",
        filterNP:           "N. Piedmont",
        filterRV:           "Ridge & Valley",
        filterACPB:         "Atlantic Coastal Pine Barrens",
        filterNH:           "NE Highlands",
        filterNCA:          "N. Central Appalachian",
        filterAspenBirch:       "Aspen/Birch",
        filterElmAshCottonwood: "Elm/Ash/Cottonwood",
        filterLobLolly:         "Loblolly Pine",
        filterMapleBeechBirch:  "Maple/Beech/Birch",
        filterOakHickory:       "Oak/Hickory",
        filterSpruceFir:        "Spruce/Fir",
        filterWhiteRedJackPine: "White/Jack Pine",
        filterGrowthRate:       "Growth Rate",
        filterShadeTolerance:   "Shade Tolerance",
        filterEdible:           "Edible",
        filterLumber:           "Lumber",
        filterFuelWood:         "Fuel Wood",
        filterPollinators:      "Attracts Pollinators",
        filterBirds:            "Attracts Birds",
        filterWindbreak:        "Windbreak",
        filterDeer:             "Deer Resistance",
        filterPest:             "Pest Susceptibility",
    };

    // Yes/No display for binary fields
    const boolDisplay = { "1": "Yes", "0": "No" };

    Object.entries(filterLabels).forEach(([id, label]) => {
        const el = document.getElementById(id);
        if (el && el.value !== "") {
            const display = boolDisplay[el.value] ?? el.value;
            parts.push(`${label}: ${display}`);
        }
    });

    // Sliders — only include if not at default
    if (lifeSlider?.noUiSlider) {
        const [min, max] = lifeSlider.noUiSlider.get().map(Math.round);
        if (min !== 0 || max !== 300) parts.push(`Lifespan: ${min}–${max} yrs`);
    }
    if (heightSlider?.noUiSlider) {
        const [min, max] = heightSlider.noUiSlider.get().map(Math.round);
        if (min !== 0 || max !== 100) parts.push(`Height: ${min}–${max} ft`);
    }
    if (canopySlider?.noUiSlider) {
        const [min, max] = canopySlider.noUiSlider.get().map(Math.round);
        if (min !== 0 || max !== 100) parts.push(`Canopy: ${min}–${max} ft`);
    }
    if (knownInteractionsSlider?.noUiSlider) {
        const [min, max] = knownInteractionsSlider.noUiSlider.get().map(Math.round);
        if (min !== 0 || max !== 800) parts.push(`Known Interactions: ${min}–${max}`);
    }

    return parts.length > 0 ? parts : ["No filters applied — showing all species"];
}

function exportPDF() {
    if (!currentRows || currentRows.length === 0) {
        alert("No results to export. Apply filters first.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });

    // --- Build column definitions based on visible groups ---
    const allColumns = [
        { header: "Species",              dataKey: "species",                       group: "general" },
        { header: "Common Name",          dataKey: "CommonName",                    group: "general" },
        { header: "Climate Tolerance",    dataKey: "AGCT",                          group: "climate" },
        { header: "Commercial Prod.",     dataKey: "ACProd",                        group: "prod" },
        { header: "Wetland Status",       dataKey: "NWIStatus",                     group: "wetland" },
        { header: "Floodplain",           dataKey: "FloodPlainBottomLand",          group: "landform", bool: true },
        { header: "Upland Mesic",         dataKey: "UplandMesic",                   group: "landform", bool: true },
        { header: "Upland Dry",           dataKey: "UplandDry",                     group: "landform", bool: true },
        { header: "Soil Acid",            dataKey: "SoilAcidTol",                   group: "soil" },
        { header: "Soil Alk",             dataKey: "SoilAlkTol",                    group: "soil" },
        { header: "Soil Salt",            dataKey: "SoilSaltTol",                   group: "soil" },
        { header: "E. Great Lake",        dataKey: "EasternGreatLakeLowLands",      group: "ecoregion", bool: true },
        { header: "N. Allegheny",         dataKey: "NorthernAlleghenyPlateau",      group: "ecoregion", bool: true },
        { header: "Erie Drift",           dataKey: "ErieDriftPlain",                group: "ecoregion", bool: true },
        { header: "N. Coastal",           dataKey: "NorthernCoastalZone",           group: "ecoregion", bool: true },
        { header: "N. Piedmont",          dataKey: "NorthernPiedmont",              group: "ecoregion", bool: true },
        { header: "Ridge & Valley",       dataKey: "RidgeAndValley",                group: "ecoregion", bool: true },
        { header: "Atlantic Pine",        dataKey: "AtlanticCoastalPineBarrens",    group: "ecoregion", bool: true },
        { header: "NE Highlands",         dataKey: "NortheasternHighlands",         group: "ecoregion", bool: true },
        { header: "N. Appalachian",       dataKey: "NorthCentralAppalachian",       group: "ecoregion", bool: true },
        { header: "Aspen/Birch",          dataKey: "AspenBirch",                    group: "forestType", bool: true },
        { header: "Elm/Ash/Cotton.",      dataKey: "ElmAshCottonwood",              group: "forestType", bool: true },
        { header: "Loblolly Pine",        dataKey: "LoblollyShortleafPine",         group: "forestType", bool: true },
        { header: "Maple/Beech/Birch",    dataKey: "MapleBeechBirch",               group: "forestType", bool: true },
        { header: "Oak/Hickory",          dataKey: "OakHickory",                    group: "forestType", bool: true },
        { header: "Spruce/Fir",           dataKey: "SpruceFir",                     group: "forestType", bool: true },
        { header: "White/Jack Pine",      dataKey: "WhiteRedJackPine",              group: "forestType", bool: true },
        { header: "Lifespan (yr)",        dataKey: "LifeSpan",                      group: "characteristics" },
        { header: "Height (ft)",          dataKey: "TreeHeight",                    group: "characteristics" },
        { header: "Canopy (ft)",          dataKey: "CanopySpread",                  group: "characteristics" },
        { header: "Growth Rate",          dataKey: "GrowthRate",                    group: "characteristics" },
        { header: "Shade Tol.",           dataKey: "ShadeTol",                      group: "characteristics" },
        { header: "Edible",               dataKey: "Edible",                        group: "economic", bool: true },
        { header: "Lumber",               dataKey: "Lumber",                        group: "economic", bool: true },
        { header: "Fuel Wood",            dataKey: "FuelWood",                      group: "economic", bool: true },
        { header: "Eco. Interactions",    dataKey: "KnownInteractions",             group: "ecological" },
        { header: "Pollinators",          dataKey: "AttractsPollinators",           group: "ecological", bool: true },
        { header: "Birds",                dataKey: "AttractsBirds",                 group: "ecological", bool: true },
        { header: "Windbreak",            dataKey: "RecomendedForWindbreak",        group: "plantingConsiderations", bool: true },
        { header: "Deer Resistance",      dataKey: "DeerResistance",                group: "plantingConsiderations" },
        { header: "Pest Susceptibility",  dataKey: "PestAndPathogenSusceptibility", group: "plantingConsiderations" },
        { header: "Order Qty",            dataKey: "__orderQty",                    group: "general" },  // blank order column
        { header: "Notes",               dataKey: "__notes",                       group: "general" },
    ];

    // Filter to only visible groups
    const visibleColumns = allColumns.filter(col => !hiddenGroups[col.group]);

    // Build row data
    const tableRows = currentRows.map(r => {
        const row = {};
        visibleColumns.forEach(col => {
            if (col.dataKey.startsWith("__")) {
                row[col.dataKey] = "";  // blank fill-in columns
            } else if (col.bool) {
                row[col.dataKey] = booleanToYn(r[col.dataKey]);
            } else {
                row[col.dataKey] = r[col.dataKey] ?? "";
            }
        });
        return row;
    });

    // Title and metadata
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("NY Collaborative Priority Species — Order Sheet", 40, 36);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const filterSummary = buildFilterSummary();
    const summaryText = `Generated: ${dateStr}   |   Results: ${currentRows.length} species`;
    doc.text(summaryText, 40, 52);

    // Print each active filter, wrapping into multiple lines if needed
    doc.setFontSize(8);
    doc.setTextColor(80);
    const pageWidth = doc.internal.pageSize.getWidth();
    const summaryLines = doc.splitTextToSize(
        "Filters: " + filterSummary.join("  ·  "),
        pageWidth - 80  // respect margins
    );
    doc.text(summaryLines, 40, 64);



    // Table
    doc.autoTable({
        columns: visibleColumns.map(col => ({ header: col.header, dataKey: col.dataKey })),
        body: tableRows,
        startY: 65,
        styles: {
            fontSize: 7,
            cellPadding: 3,
            overflow: "linebreak",
        },
        headStyles: {
            fillColor: [4, 120, 87],   // green-700
            textColor: 255,
            fontStyle: "bold",
            halign: "center",
        },
        bodyStyles: {
            halign: "center",
        },
        columnStyles: {
            // Give the fill-in columns more room
            __orderQty: { cellWidth: 40 },
            __notes:    { cellWidth: 80 },
        },
        alternateRowStyles: {
            fillColor: [244, 251, 247],
        },
        didParseCell: function(data) {
            // Highlight priority species rows
            const row = currentRows[data.row.index];
            if (row && row.priority == 1 && data.section === "body") {
                data.cell.styles.fontStyle = "bold";
            }
        },
        margin: { left: 30, right: 30 },
    });

    // Page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 20,
            { align: "center" }
        );
    }

    doc.save(`ny-species-order-sheet-${new Date().toISOString().slice(0,10)}.pdf`);
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

    if(lifeSlider && lifeSlider.noUiSlider){
        lifeSlider.noUiSlider.set([0, 300]);
    }
    if(heightSlider && heightSlider.noUiSlider){
        heightSlider.noUiSlider.set([0, 100]);
    }
    if(canopySlider && canopySlider.noUiSlider){
        canopySlider.noUiSlider.set([0, 100]);
    }
    if(knownInteractionsSlider && knownInteractionsSlider.noUiSlider){
        knownInteractionsSlider.noUiSlider.set([0, 800]);
    }

    document.querySelectorAll('select').forEach(select => {
        updateColor(select);
        select.addEventListener('change', () => updateColor(select));
    });
}

// function toggleGroup(group) {
//   hiddenGroups[group] = !hiddenGroups[group];

//   const elements = document.querySelectorAll(`[data-group="${group}"]`);
//   elements.forEach(function(el) {
//     el.style.display = hiddenGroups[group] ? "none" : "";
//   });
// }


function toggleGroup(groupName) {
    const isHidden = hiddenGroups[groupName];

    const headers = document.querySelectorAll(
        `thead tr:nth-child(2) th[data-group="${groupName}"]`
    );
    const rows = document.querySelectorAll("#tableBody tr");

    headers.forEach(th => {
        const index = th.cellIndex;

        th.style.display = isHidden ? "none" : "";

        rows.forEach(row => {
            if (row.children[index]) {
                row.children[index].style.display = isHidden ? "none" : "";
            }
        });
    });

    // top grouped header row
    const topHeader = document.querySelector(
        `thead tr:nth-child(1) th[data-group="${groupName}"]`
    );

    if (topHeader) {
        if (isHidden) {
            topHeader.style.display = "none";
        } else {
            topHeader.style.display = "";
            topHeader.colSpan = headers.length;
        }
    }
}

function toggleAll(){
    const toggles = document.querySelectorAll('[data-group-toggle]');
    const allChecked = [...toggles].every(t=>t.checked);
    toggles.forEach(t =>{
        t.checked = !allChecked;
        t.dispatchEvent(new Event('change'));
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

function updateColor(select){
    if (select.value == ""){
        select.classList.add("is-default");
    }
    else{
        select.classList.remove("is-default");
    }
}



document.addEventListener("DOMContentLoaded", async () => {

    lifeSlider = document.getElementById('lifespanSlider');
    heightSlider = document.getElementById('heightSlider');
    canopySlider = document.getElementById('canopySlider');
    knownInteractionsSlider = document.getElementById("knownInteractionsSlider");

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

    if (knownInteractionsSlider) {
        noUiSlider.create(knownInteractionsSlider, {
            start: [0, 800],
            connect: true,
            range: { min: 0, max: 800 },
            step: 1
        });

        const knownInteractionsMinVal = document.getElementById("knownInteractionsMinVal");
        const knownInteractionsMaxVal = document.getElementById("knownInteractionsMaxVal");

        knownInteractionsSlider.noUiSlider.on('update', (values) => {
            knownInteractionsMinVal.textContent = Math.round(values[0]);
            knownInteractionsMaxVal.textContent = Math.round(values[1]);
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
    await populateDropdown("filterDeer", "PlantingConsiderations", "DeerResistance");
    await populateDropdown("filterPest", "PlantingConsiderations", "PestAndPathogenSusceptibility");

document
    .getElementById("applyFilters")
    .addEventListener("click", fetchAndRenderTrees);

document
    .getElementById("clearFilters")
    .addEventListener("click", () => {
      clearFilters();
      fetchAndRenderTrees();
    });
document
    .getElementById("toggleAll")
    .addEventListener("click", () => {
        toggleAll();
    });
document
    .getElementById("export")
    .addEventListener("click", exportPDF);

document.querySelectorAll('[data-group-toggle]').forEach(cb => {
    const group = cb.dataset.groupToggle;

    // start checked when page loads
    cb.checked = !hiddenGroups[group];

    cb.addEventListener('change', () => {
        hiddenGroups[group] = !cb.checked;
        toggleGroup(group);
    });
});

document.querySelectorAll('select').forEach(select => {
    updateColor(select);
    select.addEventListener('change', () => updateColor(select));
});


    fetchAndRenderTrees();
});