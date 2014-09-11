var width = 960,
height = 960;

var svg = d3.select('body').append('svg')
.attr({"width": width, "height": height});

d3.json('states_au.json', function(error, au) {
  if (error) return console.error(error);
  // console.log(world);

  var states = topojson.feature(au, au.objects.states);

  // var projection = d3.geo.mercator()
  // .scale(800)
  // .translate([-950, 50]);

  var projection = d3.geo.albers()
  .rotate([-133, 0])
  .center([0, -28])
  .parallels([-10, -45])
  .scale(1400)
  .translate([width / 2, height / 2])
  .precision(.1);

  var path = d3.geo.path()
  .projection(projection);

  svg.selectAll(".state")
  .data(states.features)
  .enter().append("path")
  .attr("class", function(d) { return "state " + d.id.toLowerCase().replace(/\s+/g,'-'); })
  .attr("d", path);

  svg.selectAll(".state-label")
    .data(topojson.feature(au, au.objects.states).features)
  .enter().append("text")
    .attr("class", function(d) { return "state-label " + d.id.toLowerCase().replace(/\s+/g,'-'); })
    .attr("transform", function(d) {
      var center = path.centroid(d);
      console.log(center);
      console.log(center.prototype);
      return "translate(" + (center[0] - 30) + "," + center[1] + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.id; });
});
