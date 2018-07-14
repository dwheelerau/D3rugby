var maxNames = 20;
var choice = ["Australia", "New Zealand"];
var colors = {"Australia": "#ffe200",
                "NZ": "black"};
var currentChoice = choice[0];

d3.selectAll("h2").text(currentChoice + " World Cup leading try scorers");
var dataJson;

d3.json("static/data/data2.json", function(error, data) {
    if (error) {
        throw error;
    }
    dataJson = data; 
    drawBox();
});

function drawBox() {
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
        .domain([0, d3.max(dataJson[currentChoice], function(d) {
            return d.try;
        })]);
    var names = dataJson[currentChoice].map(function(t) {
        return t.name;
    }).slice(0, maxNames);

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], 0.1)
        .domain(names);

    // draw the axes
    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0) // no ticks would be 0
        .orient("left"); // barh
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0) // no ticks
        .orient("bottom");
    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    // append the data to the bars
    var bars = svg.selectAll(".bar")
        .data(dataJson[currentChoice])
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
            return x(d.try);
        })
        .attr("fill", colors[currentChoice]);
    // add labels to right of each bar
    bars.append("text")
        .attr("class", "label")
        // pos of lab half down bar
        .attr("y", function(d) {
            return y(d.name) + y.rangeBand() / 2 + 4;
        })
        // pos 3 pix to the right of the bar
        .attr("x", function(d) {
            return x(d.try) + 3;
        })
        .text(function(d) {
            return d.try;
        });

    // onclick function to update data
    bars.on('click', function() {
        if (currentChoice == choice[0]) {
            currentChoice = choice[1];
        } else {
            currentChoice = choice[0];
        }
        d3.selectAll("h2").text(currentChoice + " World Cup leading try scorers");
        // update axes
        names = dataJson[currentChoice].map(function(t) {
            return t.name;
        }).slice(0, maxNames);

        y.domain(names);
        x.domain([0, d3.max(dataJson[currentChoice], function(d) {
            return d.try;
        })]);
        // call the axis to update
        gy.call(yAxis);
        // update the data, need enter because size has changed
        svg.selectAll(".bar")
            .data(dataJson[currentChoice])
            .enter()
            .append("g");
        // now redarw the rectangles using new data
        bars.selectAll('rect')
            .transition()
            .attr("y", function(d) {
                // 'y' here is the y scale
                return y(d.name);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function(d) {
            return x(d.try);
            })
            .each("end", function() { // <-- Executes at end of transition
                d3.select(this)
                .attr("fill", colors[currentChoice]);
            });
        // add the new data to the labels using the class name
        svg.selectAll(".label")
        .data(dataJson[currentChoice])
        .enter();
        // use this data to update text and position
        bars.selectAll("text")
            .transition()
            // pos of lab half down bar
            .attr("y", function(d) {
                return y(d.name) + y.rangeBand() / 2 + 4;
            })
            // pos 3 pix to the right of the bar
            .attr("x", function(d) {
                console.log(d.try);
                return x(d.try) + 3;
            })
            .text(function(d) {
                return d.try;
            });
    });
}
