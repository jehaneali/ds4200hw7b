var margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 860 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg1 = d3
  .select("#dataviz_brushScatter")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3
  .select("#dataviz_brushScatter")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg3 = d3
  .select("#dataviz_brushScatter")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Color scale
var color = d3
  .scaleOrdinal()
  .domain(["Red", "Orange", "Green", "Blue"])
  .range(["#e62525", "#eb9307", "#067318", "#2936ab"]);

//Load Data
d3.csv("MBTA_Line_and_Stop.csv").then((data) => {
  // Scatterplot 1
  {

    let scData = [
      { time_period_name: "AM_PEAK", avg: 50 },
      { time_period_name: "EVENING", avg: 30 },
      { time_period_name: "MIDDAY_SCHOOL", avg: 60 },
    ];

    var xKey1 = "time_period_name";
    var yKey1 = "avg";

    //Add X axis
    var x1 = d3
      .scaleLinear()
      .domain(scData.map(function (d) {
        return d["time_period_name"];
      }))
      // .domain(scData.map(function(d) { return d.time_period_name; }))
      // .domain(d3.extent(scData.map((val) => val[xKey1])))
      .range([0, width]);
    svg1
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x1))
      .call((g) =>
        g
          .append("text")
          .attr("x", width)
          .attr("y", margin.bottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(xKey1)
      );

    //Add Y axis
    var y1 = d3
      .scaleLinear()
      .domain(d3.extent(scData.map((val) => val[yKey1])))
      .range([height, 0]);
    svg1
      .append("g")
      .call(d3.axisLeft(y1))
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yKey1)
      );

    // Add dots
    var myCircle1 = svg1
      .append("g")
      .selectAll("circle")
      .data(scData)
      .enter()
      .append("circle")
      .attr("id", (d) => d.id)
      .attr("cx", function (d) {
        return x1(d[xKey1]);
      })
      .attr("cy", function (d) {
        return y1(d[yKey1]);
      })
      .attr("r", 8)
      .style("fill", function (d) {
        return color(d.Species);
      })
      .style("opacity", 0.5);

    //Define a brush
    var brush1 = d3
      .brush()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("start", clear)
      .on("brush", updateChart1);

    //Adding brush to the svg
    svg1.call(brush1);
  }

  // Scatterplot 2
  {
    var xKey2 = "total_offs";
    var yKey2 = "total_ons";
    var colorKey = "route_id"

    //Add X axis
    var x2 = d3
      .scaleLinear()
      .domain(d3.extent(data.map((val) => val[xKey2])))
      .range([0, width]);
    svg2
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2))
      .call((g) =>
        g
          .append("text")
          .attr("x", width)
          .attr("y", margin.bottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(xKey2)
      );

    //Add Y axis
    var y2 = d3
      .scaleLinear()
      .domain(d3.extent(data.map((val) => val[yKey2])))
      .range([height, 0]);
    svg2
      .append("g")
      .call(d3.axisLeft(y2))
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yKey2)
      );

    // Add dots
    var myCircle2 = svg2
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("id", (d) => d.id)
      .attr("cx", function (d) {
        return x2(d[xKey2]);
      })
      .attr("cy", function (d) {
        return y2(d[yKey2]);
      })
      .attr("r", 8)
      .style("fill", function (d) {
        return color(d.route_id);
      })
      .style("opacity", 0.5);

    //Define a brush
    var brush2 = d3
      .brush()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("start", clear)
      .on("brush", updateChart2);

    //Add brush to svg
    svg2.call(brush2);
  }

  //Barchart with counts of different species
  {
    //This data is hard coded for demonstration.
    let barChartData = [
      { time_period_name: "VERY_EARLY_MORNING", count: 50 },
      { time_period_name: "PM_PEAK", count: 50 },
      { time_period_name: "EARLY_AM", count: 50 },
    ];

    var x3 = d3
      .scaleBand()
      .range([0, width])
      .domain(
        barChartData.map(function (d) {
          return d["time_period_name"];
        })
      )
      .padding(0.2);
    svg3
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x3))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y3 = d3.scaleLinear().domain([0, 50]).range([height, 0]);
    svg3.append("g").call(d3.axisLeft(y3));

    // Bars
    var bars = svg3
      .selectAll("mybar")
      .data(barChartData)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x3(d["time_period_name"]);
      })
      .attr("y", function (d) {
        return y3(d["count"]);
      })
      .attr("width", x3.bandwidth())
      .attr("height", function (d) {
        return height - y3(d["count"]);
      })
      .style("fill", function (d) {
        return color(d["time_period_name"]);
      });
  }

  //Brushing Code---------------------------------------------------------------------------------------------

  //Removes existing brushes from svg
  function clear() {
    svg1.call(brush1.move, null);
    svg2.call(brush2.move, null);
  }

  //Is called when we brush on scatterplot #1
  function updateChart1(brushEvent) {
    extent = brushEvent.selection;

    //Check all the circles that are within the brush region
    myCircle1.classed("selected", (d) => {
      return isBrushed(extent, x1(d[xKey1]), y1(d[yKey1]));
    });

    //Select all the data points in plot 2 which have the same id as in plot 1
    myCircle2.classed("selected", (d) => {
      return isBrushed(extent, x1(d[xKey1]), y1(d[yKey1]));
    });
  }

  //Is called when we brush on scatterplot #2
  function updateChart2(brushEvent) {
    extent = brushEvent.selection;
    var selectedSpecies = new Set();

    //Check all the circles that are within the brush region
    myCircle2.classed("selected", (d) => {
      let brushed = isBrushed(extent, x2(d[xKey2]), y2(d[yKey2]));
      if (brushed) selectedSpecies.add(d.time_period_name);
      return brushed;
    });
    myCircle1.classed("selected", (d) => {
      return isBrushed(extent, x2(d[xKey2]), y2(d[yKey2]));
    });

    //Check the bars based on species selected
    bars.classed("selected", function (d) {
      return selectedSpecies.has(d["time_period_name"]);
    });
  }

  //Finds dots within the brushed region
  function isBrushed(brush_coords, cx, cy) {
    if (brush_coords === null) return;

    var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
  }
});
