/*
 * Chart - Density Scatter Plot (Hexbin)
 */ 
Chart = function (_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data; 
    this.displayData = [];
    this.selectedGenre = "All"; 
    this.selectedMetric = "Anxiety"; 

    this.initVis();
};

/*
 * Chart - Standard Scatter Plot with Density (Opacity/Jitter)
 */ 
Chart.prototype.initVis = function () {
    var vis = this;

    vis.margin = {top: 50, right: 150, bottom: 60, left: 80};
    vis.width = 900 - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Scales
    vis.x = d3.scaleLinear().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    // Simple Color Scale for Instrumentalist
    vis.color = d3.scaleOrdinal()
        .domain(["Yes", "No"])
        .range(["#0d6efd", "#ffc107"]); // Bootstrap Blue and Yellow

    // Axes
    vis.xAxis = d3.axisBottom(vis.x);
    vis.yAxis = d3.axisLeft(vis.y);

    vis.svg.append("g").attr("class", "x-axis axis").attr("transform", `translate(0,${vis.height})`);
    vis.svg.append("g").attr("class", "y-axis axis");

    vis.yLabel = vis.svg.append("text")
        .attr("transform", "rotate(-90)").attr("y", -50).attr("x", -vis.height / 2)
        .attr("text-anchor", "middle");

    this.wrangleData();
};

Chart.prototype.wrangleData = function (genreFilter, metricFilter) {
    let vis = this;
    if (genreFilter) vis.selectedGenre = genreFilter;
    if (metricFilter) vis.selectedMetric = metricFilter || "Anxiety"; 

    vis.displayData = vis.data.filter(d => {
        let genreMatch = (vis.selectedGenre === "All" || d["Fav genre"] === vis.selectedGenre);
        return genreMatch && !isNaN(d["Hours per day"]) && !isNaN(d[vis.selectedMetric]);
    });

    vis.updateVis();
};

Chart.prototype.updateVis = function () {
    let vis = this;

    // 1. Update Domains
    vis.x.domain([0, d3.max(vis.displayData, d => d["Hours per day"]) || 24]);
    vis.y.domain([0, 10]);

    vis.yLabel.text(vis.selectedMetric + " Level");

    // 2. Data Binding
    let circles = vis.svg.selectAll(".dot")
        .data(vis.displayData);

    // 3. Enter + Update
    circles.enter().append("circle")
        .attr("class", "dot")
        .merge(circles)
        .transition().duration(800)
        .attr("r", 4)
        // Add a small random "jitter" so overlapping points are visible
        .attr("cx", d => vis.x(d["Hours per day"]) + (Math.random() * 6 - 3))
        .attr("cy", d => vis.y(d[vis.selectedMetric]) + (Math.random() * 6 - 3))
        .attr("fill", d => vis.color(d.Instrumentalist))
        .attr("opacity", 0.4) // Low opacity creates the density effect
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);

    circles.exit().remove();

    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").transition().duration(800).call(vis.yAxis);
};