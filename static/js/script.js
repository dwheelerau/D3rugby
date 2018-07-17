var maxNames = 20;
var colors = {"Australia": "#ffe200",
                "New Zealand": "black",
                "Argentina": "#4295f4",
                "Canada": "red",
                "England": "white",
                "Fiji": "white",
                "France": "blue",
                "Georgia": "#9d2823",
                "Ireland": "green",
                "Italy": "blue",
                "Japan": "red",
                "Namibia": "light blue",
                "Portugal": "white",
                "Romania": "yellow",
                "Russia": "red",
                "Samoa": "blue",
                "Scotland": "dark blue",
                "South Africa": "green",
                "Tonga": "red",
                "Uruguay": "#4396cc",
                "United States": "white",
                "Wales": "red",
                "Zimbabwe": "green"};

var currentChoice = "";

d3.selectAll("h2").text(currentChoice + " Rugby World Cup leading try scorers");
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
        }
    }

    sortable.sort(function(a, b) {
            return d3.descending(a[1]['try'], b[1]['try']);
    });
    // note this obj is a little strange...
    var bestPlayer = sortable.slice(0, maxNames);
    var key = function(d) {
    for (var i=0; i < names.length; i++) {
        if (d.name == names[i]) {
            return d.name;
            }
        }
    };
    var keyBest = function(d) {
    return d.name;
    };

    var margin = {
        top: 15,
        right: 200,
        bottom: 15,
        left: 200};

    var width = 950 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#graphic")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width-150])
        .domain([0, d3.max(bestPlayer[1], function(d) {
            return d.try;
        })]);
    // get the names for the y axis
    var names = [];
    for (var i=0; i<bestPlayer.length; i++) {
       names.push(bestPlayer[i][1].name);
    }
    var y = d3.scaleBand()
        .rangeRound([height, 0], 0.1)
        .domain(names)
        .padding(.1);

    // draw the axes
    var yAxis = d3.axisLeft(y)
    var xAxis = d3.axisBottom(x)
    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    // append the data to the bars
    var bars = svg.selectAll(".bar")
        .data(bestPlayer)
        .enter()
        .append("g");
    // add the rectangles
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function(d) {
            return y(d[1].name);
        })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function(d) {
            return x(d[1].try);
        })
        .attr("fill", "#4295f4")
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);
    // add labels to right of each bar
    bars.append("text")
        .attr("class", "label")
        // pos of lab half down bar
        .attr("y", function(d) {
            return y(d[1].name) + y.bandwidth() / 2 + 4 ;
        })
        // pos 3 pix to the right of the bar
        .attr("x", function(d) {
            return x(d[1].try) + 3;
        })
        .text(function(d) {
            console.log(d);
            return d[1].try + " tries for " + d[2];
        });

    // onclick function to update data
    d3.select('#inds').on("change", function () {
        var sect = document.getElementById("inds");
        var currentChoice = sect.options[sect.selectedIndex].value;
        d3.selectAll("h2").text(currentChoice + " World Cup leading try scorers");
        // update axes
        if (currentChoice == "All countries") {
            location.reload();
        } else {
        var dataUpdate = dataJson[0][currentChoice];
        names = dataJson[0][currentChoice].map(function(t) {
            return t.name;
        }).slice(0, maxNames);

        y.domain(names);
        // don't update x-axis, just keep at max values from best players
        //x.domain([0, d3.max(dataJson[0][currentChoice], function(d) {
        //    return d.try;
        //})]);
        // call the axis to update
        gy.call(yAxis);
        // update the data, need enter because size has changed
        svg.selectAll(".bar")
            .data(dataJson[0][currentChoice]);
        // now redarw the rectangles using new data
        bars.selectAll('rect')
            .attr("y", function(d) {
                // 'y' here is the y scale
                return y(d.name);
            })
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", function(d) {
                return x(d.try);
            })
            .attr("fill", "#4295f4")
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);

        // add the new data to the labels using the class name
        svg.selectAll(".label")
            .data(dataJson[0][currentChoice].slice(0,20));
        // use this data to update text and position
        bars.selectAll("text")
            // pos of lab half down bar
            .attr("y", function(d) {
                return y(d.name) + y.bandwidth() / 2 + 4;
            })
            // pos 3 pix to the right of the bar
            .attr("x", function(d) {
                return x(d.try) + 3;
            })
            .text(function(d) {
                return d.try;
            });
        }
    });
}
function mouseover(d) {
    console.log(d);
    try {
        var file = "static/data/" + d[1].name + ".jpg"
    }
    catch(err) {
        var file = "static/data/" + d.name + ".jpg"
    }
    d3.select(this).style('fill', 'orange');
    d3.select("#tooltip")
        .select("#value")
        .text(file);
    //d3.select("#image")
    //    .append('img')
    //    .attr('src', file)
    //    .attr('height', 130)
    //    .attr('width', 115);

    var image = new Image();

    image.onload = function() {
        // image exists and is loaded
        d3.select("#image")
            .append('img')
            .attr('src', file)
            .attr('height', 130)
            .attr('width', 115);
        }
    image.onerror = function() {
        // image did not load
        var missing_file = 'static/data/no_image.png';
        d3.select("#image")
            .append('img')
            .attr('src', missing_file)
            .attr('height', 130)
            .attr('width', 115);
        }

        image.src = file;
    //.append('img')
    //   .attr('src',file)
    //   .attr("width", 150)
    //   .attr("height", 150);
    d3.select("#tooltip").classed("hidden", false);
    d3.select("#tooltip")
        .style("top", (event.pageY-10)+"px")
        .style("left", (event.pageX-10)+"px");
}
function mouseout(d) {
    d3.select("#tooltip").classed("hidden", true);
    d3.select(this).style('fill', '#4295f4');
    d3.select("#image").select('img').remove()
}
