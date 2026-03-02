function getVal(id) {
    return document.getElementById(id).value.trim();
}

function buildParams() {
    const params = new URLSearchParams();

    const species = getVal("filterSpecies");
    const CommonName = getVal("filterCommon");
    const agct = getVal("filterAGCT");
    const acprod = getVal("filterACProd");
    const nwistatus = getVal("filterNWI")
    const floodbottom = getVal("filterFloodBottom");
    const uplandmesic = getVal("filterUplandMesic");
    const uplanddry = getVale("filterUplandDry");

    if (species) params.set("species", species);
    if (CommonName) params.set("CommonName", CommonName);
    if (agct) params.set("agct", agct);
    if (acprod) params.set("acprod", acprod);
    if (nwistatus) params.set("nwistatus", nwistatus);
    if (floodbottom) params.set("floodbottom", floodbottom);
    if (uplandmesic) params.set("uplandmesic", uplandmesic);
    if (uplanddry) params.set("uplanddry", uplanddry);

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
            <td>${r.AGCT ?? ""}</td>
            <td>${r.ACProd ?? ""}</td>
            <td>${r.NWIStatus ?? ""}</td>
            <td>${r.FloodPlainBottomLand ?? ""}</td>
            <td>${r.UplandMesic ?? ""}</td>
            <td>${r.UplandDry ?? ""}</td>
        `;
        tbody.appendChild(tr);
    });
}

function clearFilters() {
    document.getElementById("filterSpecies").value = "";
    document.getElementById("filterCommon").value = "";
    document.getElementById("filterAGCT").value = "";
    document.getElementById("filterACProd").value = "";
    document.getElementById("filterNWI").value = "";

}

document.addEventListener("DOMContentLoaded", async () => {
    await populateDropdown("filterSpecies", "Trees", "species");
    await populateDropdown("filterCommon", "Trees", "CommonName");
    await populateDropdown("filterNWI", "Trees","NWIStatus" )

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