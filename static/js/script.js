d3.json("static/data/data.json", function(error, data) {
    if (error) throw error;
    data = data.sort(function(a, b) {
        return d3.ascending(a.value, b.value);
    });

// setup svg margin conventions
var margin = {
    top: 15,
    right: 25,
    bottom: 15,
    left: 150};

var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select("#graphic")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
    .range([0, width])
    .domain([0, d3.max(data, function(d) {
        return d.value;
    })]);

var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], 0.1)
    .domain(data.map(function(d) {
        return d.name;
    }));

// draw the y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(0) // no ticks
    .orient("left"); // barh

var gy = svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis);

var bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g");

// add the rectangles
bars.append("rect")
    .attr("class", "bar")
    .attr("y", function(d) {
        return y(d.name);
    })
    .attr("height", y.rangeBand())
    .attr("x", 0)
    .attr("width", function(d) {
        return x(d.value);
    });
// add labels to right of each bar
bars.append("text")
    .attr("class", "label")
    // pos of lab half down bar
    .attr("y", function(d) {
        return y(d.name) + y.rangeBand() / 2 + 4;
    })
    // pos 3 pix to the right of the bar
    .attr("x", function(d) {
        return x(d.value) + 3;
    })
    .text(function(d) {
        return d.value;
    });
});
