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
        if (dataJson[0].hasOwnProperty(c)) {
        for (var n in dataJson[0][c]) {
            if (dataJson[0][c].hasOwnProperty(n)) {
            var info = [n, dataJson[0][c][n], c];
            sortable.push(info);
        }
        }
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
        top: 25,
        right: 200,
        bottom: 25,
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
    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x)
        .ticks(15);
    ;// var xAxis = d3.axisBottom(x);
    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    var gx = svg.append("g")
        .attr("class", "x axis")
        .attr("transform",
            "translate(0," + (height - 10) + ")")
        .call(xAxis);
    svg.append("text")
        .attr("transform",
            "translate(150," + (height + 25) + ")")
        .text("tries scored");
    // create bars
    svg.selectAll("rect")
        .data(bestPlayer)
        .enter()
        .append("rect")
        .attr("y", function(d) {
            return y(d[1].name);
        })
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("width", function(d) {
            return x(d[1].try);
        })
        .attr("fill", "#4295f4")
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);

    //  this is not working?
    svg.selectAll("text")
        .data(bestPlayer)
        .enter()
        .append("text")
        .text(function(d) {
            return d[1].try + " tries for " + d[2];
        })
        .attr("text-anchor", "middle")
        // pos of lab half down bar
        .attr("y", function(d) {
            return y(d[1].name) + y.bandwidth() / 2 + 4;
        })
        // pos 3 pix to the right of the bar
        .attr("x", function(d) {
            return x(d[1].try) + 3;
        });

        // onclick function to update data
    d3.select('#inds').on("change", function() {
        var sect = document.getElementById("inds");
        var currentChoice = sect.options[sect.selectedIndex].value;
        d3.selectAll("h2").text(currentChoice +
            " World Cup leading try scorers");
        // update axes
        if (currentChoice == "All countries") {
            location.reload();
        } else {
            // var dataUpdate = dataJson[0][currentChoice];
            names = dataJson[0][currentChoice].map(function(t) {
            return t.name;
        }).slice(0, maxNames);

        y.domain(names);
        // call the axis to update
        gy.call(yAxis);
        svg.selectAll("rect")
            .data(dataJson[0][currentChoice])
            .transition()
            .delay(100)
            .attr("y", function(d) {
                // 'y' here is the y scale
                return y(d.name);
            })
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", function(d) {
                return x(d.try);
            })
            .attr("fill", "#4295f4");
        }
    });
}

function mouseover(d) {
    console.log(d);
    d3.select("#image").select('img').remove();
    try {
        var file = "static/data/" + d[1].name + ".jpg";
    } catch (err) {
        var file = "static/data/" + d.name + ".jpg";
    }
    d3.select(this).style('fill', 'orange');
    // leave this code, allows adding a tooltip
    // d3.select('#tooltip")
    //    .select("#value")
    //    .text(file);

    var image = new Image();

    image.onload = function() {
        // image exists and is loaded
        d3.select("#image")
            .append('img')
            .attr('src', file)
            .attr('height', 130)
            .attr('width', 115);
        };
    image.onerror = function() {
        // image did not load
        var missing_file = 'static/data/blank.png';
        d3.select("#image")
            .append('img')
            .attr('src', missing_file)
            .attr('height', 130)
            .attr('width', 115);
        };
    image.src = file;

    // d3.select("#tooltip").classed("hidden", false);
    d3.select("#tooltip").classed("hidden", true);
    d3.select("#tooltip")
        .style("top", (event.pageY-10)+"px")
        .style("left", (event.pageX-10)+"px");
}
function mouseout(d) {
    d3.select("#tooltip").classed("hidden", true);
    d3.select(this).style('fill', '#4295f4');
    d3.select("#image").select('img').remove();
}

