let chart;

d3.csv("data/music_mental_health.csv").then(data => {
    data.forEach(d => {
        d["Hours per day"] = +d["Hours per day"];
        d["Anxiety"] = +d["Anxiety"];
        d["Insomnia"] = +d["Insomnia"];
        d["Depression"] = +d["Depression"];
        d["OCD"] = +d["OCD"];
    });

    chart = new Chart("#chart-area", data);
}).catch(error => console.error("Error loading CSV:", error));

function updateChart() {
    const metric = document.getElementById("select-metric").value;
    const instrumentalist = document.getElementById("select-instrumentalist").value;
    
    chart.wrangleData(metric, instrumentalist);
}

document.getElementById("select-metric").onchange = updateChart;
document.getElementById("select-instrumentalist").onchange = updateChart;