var maxNames = 20;
var colors = {"Australia": "#ffe200",
                "New Zealand": "black",
                "Argentina": "#4295f4",
                "Canada":"red",
                "Ivory Coast":"orange",
                "England":"white",
                "Fiji":"white",
                "France":"blue",
                "Georgia":"#9d2823",
                "Ireland":"green",
                "Italy":"blue",
                "Japan":"red",
                "Namibia":"light blue",
                "Portugal":"white",
                "Romania":"yellow",
                "Russia":"red",
                "Samoa":"blue",
                "Scotland":"dark blue",
                "South Africa":"green",
                "Tonga":"red",
                "Uruguay":"#4396cc",
                "United States":"white",
                "Wales":"red",
                "Zimbabwe":"green"};

var choice = Object.keys(colors);
var currentChoice = choice[0];

d3.selectAll("h2").text(currentChoice + " World Cup leading try scorers");
var dataJson;

d3.json("static/data/data.json", function(error, data) {
    if (error) {
        throw error;
    }
    dataJson = data;
    drawBox();
});

function drawBox() {
    // get sorted list of values for best across all countries
    sortable = [];
    for (var c in dataJson[0]) {
        for (var n in dataJson[0][c]) {
            sortable.push([n, dataJson[0][c][n], c]);
        }}

    sortable.sort(function(a, b) {
            return d3.descending(a[1]['try'], b[1]['try']);
    });
    // note this obj is a little strange...
    var bestPlayer = sortable.slice(0, maxNames);
    var key = function(d) {
    for (var i=0; i < names.length; i++) {
        if (d.name == names[i]) {
            console.log(d.name);
            return d.name;
            }
        }
    };
    var keyBest = function(d) {
    return d.name;
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
        .domain([0, d3.max(bestPlayer[1], function(d) {
            return d.try;
        })]);
    //var names = bestPlayer[1].map(function(t) {
    //    console.log(t.name);
    //    return t.name;
    //}).slice(0, maxNames);
    var names = [];
    for (var i=0; i<bestPlayer.length; i++) {
       names.push(bestPlayer[i][1].name);
    }
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
        //.data(dataJson[0][currentChoice].slice(0,20))
        .data(bestPlayer)
        .enter()
        .append("g");
    // add the rectangles
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function(d) {
            return y(d[1].name);
        })
        .attr("height", y.rangeBand())
        .attr("x", 0)
        .attr("width", function(d) {
                    return x(d[1].try);
        })
        .attr("fill", colors[currentChoice]);
    // add labels to right of each bar
    bars.append("text")
        .attr("class", "label")
        // pos of lab half down bar
        .attr("y", function(d) {
            return y(d[1].name) + y.rangeBand() / 2 + 4;
        })
        // pos 3 pix to the right of the bar
        .attr("x", function(d) {
            return x(d[1].try) + 3;
        })
        .text(function(d) {
            return d[1].try;
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
        names = dataJson[0][currentChoice].map(function(t) {
            return t.name;
        }).slice(0, maxNames);

        y.domain(names);
        x.domain([0, d3.max(dataJson[0][currentChoice], function(d) {
            return d.try;
        })]);
        // call the axis to update
        gy.call(yAxis);
        // update the data, need enter because size has changed
        svg.selectAll(".bar")
            .data(dataJson[0][currentChoice])
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
        .data(dataJson[0][currentChoice].slice(0,20))
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
                return x(d.try) + 3;
            })
            .text(function(d) {
                return d.try;
            });
    });
}
