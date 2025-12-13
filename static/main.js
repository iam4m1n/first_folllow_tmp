function send() {
    const input = document.getElementById("grammar").value;

    let jsonData;
    try {
        jsonData = JSON.parse(input);
    } catch {
        alert("Invalid JSON");
        return;
    }

    fetch("/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData)
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("result").textContent =
            JSON.stringify(data, null, 2);
    });
}
