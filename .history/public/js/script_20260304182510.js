function getVal(id) {
    return document.getElementById(id).value.trim();
}

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

];

function buildParams() {
    const params = new URLSearchParams();

    filters.forEach(function(f){
        const val = getVal(f.id);
        if(val) params.set(f.param, val);

    });
    // const species = getVal("filterSpecies");
    // const CommonName = getVal("filterCommon");
    // const agct = getVal("filterAGCT");
    // const acprod = getVal("filterACProd");
    // const nwistatus = getVal("filterNWI")
    // const floodplainbottomland = getVal("filterFloodBottom");
    // const uplandmesic = getVal("filterUplandMesic");
    // const uplanddry = getVal("filterUplandDry");
    // const soilacidtol = getVal("filterSoilAcidTol");
    // const soilalktol = getVal("filterSoilAlkTol");
    // const soilsalttol = getVal("filterSoilSaltTol");
    
    // if (species) params.set("species", species);
    // if (CommonName) params.set("CommonName", CommonName);
    // if (agct) params.set("agct", agct);
    // if (acprod) params.set("acprod", acprod);
    // if (nwistatus) params.set("nwistatus", nwistatus);
    // if (floodplainbottomland) params.set("floodplainbottomland", floodplainbottomland);
    // if (uplandmesic) params.set("uplandmesic", uplandmesic);
    // if (uplanddry) params.set("uplanddry", uplanddry);
    // if (soilacidtol) params.set("soilacidtol", soilacidtol);
    // if (soilalktol) params.set("soilalktol", soilalktol);
    // if (soilsalttol) params.set("soilsalttol", soilsalttol);

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
            <td>${r.species ?? ""}</td>
            <td>${r.CommonName ?? ""}</td>
            <td>${r.agct ?? ""}</td>
            <td>${r.ACProd ?? ""}</td>
            <td>${r.NWIStatus ?? ""}</td>
            <td>${booleanToYn(r.FloodPlainBottomLand)}</td>
            <td>${booleanToYn(r.UplandMesic)}</td>
            <td>${booleanToYn(r.UplandDry)}</td>
            <td>${r.SoilAcidTol ?? ""}</td>
            <td>${r.SoilAlkTol ?? ""}</td>
            <td>${r.SoilSaltTol ?? ""}</td>
            
        `;
        tbody.appendChild(tr);
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
    // document.getElementById("filterSpecies").value = "";
    // document.getElementById("filterCommon").value = "";
    // document.getElementById("filterAGCT").value = "";
    // document.getElementById("filterACProd").value = "";
    // document.getElementById("filterNWI").value = "";
    // document.getElementById("filterFloodBottom").value = "";
    // document.getElementById("filterUplandMesic").value = "";
    // document.getElementById("filterUplandDry").value = "";  
    // document.getElementById("filterSoilAcidTol").value = "";
    // document.getElementById("filterSoilAlkTol").value = "";
    // document.getElementById("filterSoilSaltTol").value = "";
}

document.addEventListener("DOMContentLoaded", async () => {
    await populateDropdown("filterAGCT", "Trees", "AGCT");
    await populateDropdown("filterACProd", "Trees", "ACProd");
    await populateDropdown("filterSpecies", "Trees", "species");
    await populateDropdown("filterCommon", "Trees", "CommonName");
    await populateDropdown("filterNWI", "Trees","NWIStatus" );
    await populateDropdown("filterSoilAcidTol", "SiteChemPref", "SoilAcidTol");
    await populateDropdown("filterSoilAlkTol", "SiteChemPref", "SoilAlkTol");
    await populateDropdown("filterSoilSaltTol", "SiteChemPref", "SoilSaltTol");

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