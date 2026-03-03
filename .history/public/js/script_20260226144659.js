async function loadTrees(){
    const q = document.getElementById("searchBox").value;
    const params = new URLSearchParams({ q });
    const res = await fetch(`/api/trees?${params.toString()}`);
    const trees = await res.json();
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    trees.forEach(tree => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${tree.CommonName}</td>
        <td>${tree.species}</td>
        `;
        tbody.appendChild(row);
    });
    }

    document.getElementById("searchBox").addEventListener("input", loadTrees);

    loadTrees();
