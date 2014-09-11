var width = 960,
    height = 480;



var projection = d3.geo.equirectangular()
    .scale(153)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);




d3.json("/world.json", function(error, world) {
  var countries = topojson.feature(world, world.objects.countries);
  // svg.insert("path", ".graticule")
  //     .datum(topojson.feature(world, world.objects.countries))
  //     .attr("class", "land")
  //     .attr("d", path);

svg.selectAll(".country")
.data(countries.features)
.enter().append("path")
.attr("d", path);
});

// d3.select(self.frameElement).style("height", height + "px");
