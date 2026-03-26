let chart;

d3.csv("data/music_mental_health.csv").then(data => {
    // IMPORTANT: Make sure these match your CSV headers exactly!
    data.forEach(d => {
        d["Hours per day"] = +d["Hours per day"];
        d["Anxiety"] = +d["Anxiety"];
        d["Insomnia"] = +d["Insomnia"];
        d["Depression"] = +d["Depression"];
        d["OCD"] = +d["OCD"];
    });

    console.log("Data loaded:", data); 

    chart = new Chart("#chart-area", data);
}).catch(error => console.error("Error loading CSV:", error));

// Event listeners for both dropdowns
function updateChart() {
    const genre = document.getElementById("select-genre").value;
    const metric = document.getElementById("select-metric").value;
    chart.wrangleData(genre, metric);
}

document.getElementById("select-genre").onchange = updateChart;
document.getElementById("select-metric").onchange = updateChart;