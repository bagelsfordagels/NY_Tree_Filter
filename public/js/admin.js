//Loading tree
async function loadTrees(){
    const res = await fetch(`/api/trees`);
    const trees = await res.json();
    const tbody = document.getElementById("treeTableBody");
    tbody.innerHTML = "";

    if(trees.length === 0){
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No trees found.</td></tr>';
        return;
    }

    trees.forEach(tree => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tree.TreeId}</td>
            <td>${tree.CommonName}</td>
            <td>${tree.species}</td>
            <td>
                <button class="edit-btn" onclick="editTree(${tree.TreeId})">Edit</button>
                <button class="delete-btn" onclick="deleteTree(${tree.TreeId}, '${tree.CommonName}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    console.log(`Loaded ${trees.length} trees`);
}

//Delete tree
async function deleteTree(treeId, CommonName){
    if(!confirm(`Delete ${CommonName}?`)){
        return;
    }

    try{
        const response = await fetch(`/api/admin/removeFullTree/${treeId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if(response.ok){
            alert('Tree successfully deleted');
            loadTrees();
        }
        else{
            alert(`Error: ${result.error}`);
        }
    }catch(error){
        alert(`Error: ${error.message}`);
    }
}

//Edit tree
function editTree(treeId){
    window.location.href = `updateTree.html?id=${treeId}`;
}

loadTrees();