// d3.json("static/data/data.json", function(error, data) {
//    if (error) throw error;
//    data = data.sort(function(a, b) {
//        return d3.ascending(a.value, b.value);
//    });
// WARNING: remove the final commented braces at very end of this scrpt
// if you uncomment the above function
// setup svg margin conventions

var choice = ["Australia", "NZ"];
var currentChoice = choice[0];
// document.getElementById("h2").innerHTML = " World cup leading try scorers";
d3.selectAll("h2").text(currentChoice + " World Cup leading try scorers");
var datajson = {"Australia": [{"name": "apple",
    "score": 1},
    {"name": "ban",
        "score": 2},
    {"name": "can",
        "score": 3},
    {"name": "dan",
        "score": 4}],
    "NZ": [{"name": "zam",
        "score": 4},
    {"name": "xam",
        "score": 6},
    {"name": "pam",
        "score": 2}],
};

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
    .domain([0, d3.max(datajson.Australia, function(d) {
        return d.score;
    })]);

var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], 0.1)
    .domain(datajson.Australia.map(function(d) {
        return d.name;
    }));

// draw the axes
var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(0) // no ticks
    .orient("left"); // barh
var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0) // no ticks
    .orient("bottom");
var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
var gx = svg.append("g")
    .attr("class", "x axis")
    .call(xAxis);
// append the data to the bars
var bars = svg.selectAll(".bar")
    .data(datajson.Australia)
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
        return x(d.score);
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
        return x(d.score) + 3;
    })
    .text(function(d) {
        return d.score;
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
    y.domain(datajson[currentChoice].map(function(d) {
        return d.name;
    }));
    x.domain([0, d3.max(datajson[currentChoice], function(d) {
        return d.score;
    })]);
    // call the axis to update
    gy.call(yAxis);
    gx.call(xAxis);
    // update the data, need enter because size has changed
    svg.selectAll(".bar")
        .data(datajson[currentChoice])
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
        return x(d.score);
        });
    // add the new data to the labels using the class name
    svg.selectAll(".label")
       .data(datajson[currentChoice])
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
            console.log(d.score);
            return x(d.score) + 3;
        })
        .text(function(d) {
            return d.score;
        });
});
// });
