// Pre-fill example grammar (important for UX)
document.getElementById("grammar").value =
`S -> A B
A -> a | ε
B -> b`;


function compute() {
    const btn = document.getElementById("computeBtn");
    btn.disabled = true;
    btn.innerText = "Computing...";

    let grammarText = document.getElementById("grammar").value;

    try {
        var grammarJson = parseGrammar(grammarText);
    } catch (e) {
        alert(e.message);
        btn.disabled = false;
        btn.innerText = "Compute FIRST & FOLLOW";
        return;
    }

    fetch("/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grammarJson)
    })
    .then(res => res.json())
    .then(data => {
        renderTable("first-table", data.first);
        renderTable("follow-table", data.follow);

        const output = document.getElementById("output");
        output.classList.remove("d-none");
        output.classList.add("fade-in");
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerText = "Compute FIRST & FOLLOW";
    });
}


// Converts plain-text grammar into backend JSON format
function parseGrammar(text) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const productions = {};

    for (const line of lines) {
        if (!line.includes("->")) {
            throw new Error("Invalid grammar line: " + line);
        }

        const [lhs, rhs] = line.split("->").map(s => s.trim());

        if (!lhs || !rhs) {
            throw new Error("Invalid production: " + line);
        }

        productions[lhs] = rhs.split("|").map(p => p.trim());
    }

    return { productions };
}


// Renders FIRST / FOLLOW tables
function renderTable(tableId, data) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = "";

    for (const [nt, values] of Object.entries(data)) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${nt}</strong></td>
            <td>{ ${values.join(", ")} }</td>
        `;
        tbody.appendChild(row);
    }
}
