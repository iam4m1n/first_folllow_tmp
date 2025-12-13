function compute() {
    let grammar;
    try {
        grammar = JSON.parse(document.getElementById("grammar").value);
    } catch {
        alert("Invalid JSON input");
        return;
    }

    fetch("/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grammar)
    })
    .then(res => res.json())
    .then(data => {
        renderTable("first-table", data.first);
        renderTable("follow-table", data.follow);
        document.getElementById("output").classList.remove("d-none");
    });
}

function renderTable(tableId, obj) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = "";

    for (const [nt, values] of Object.entries(obj)) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${nt}</strong></td>
            <td>{ ${values.join(", ")} }</td>
        `;
        tbody.appendChild(row);
    }
}
