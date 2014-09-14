
var width = 960,
height = 480;


// var tooltip = CustomTooltip("placetooltip", 200)

var projection = d3.geo.equirectangular()
.rotate([-153,0])
.scale(153)
.translate([width / 2, height / 2])
.precision(.1);


var path = d3.geo.path()
.projection(projection);


var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

svg.append("rect")
.attr("width", "100%")
.attr("height", "100%")
.attr("fill", "#E6F6FF");

var radius = d3.scale.sqrt()
    .domain([0, 50])
    .range([0, 10]);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var g = svg.append("g");

d3.json("/world_50m.json", function(error, world) {
  if (error){
    console.log(error);
    return;
  }
  var countries = topojson.feature(world, world.objects.countries);

  g.selectAll(".country")
  .data(countries.features)
  .enter().append("path")
  .attr("d", path)
  .attr("class", "country");

  var mesh = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

  g.append("path")
  .datum(mesh)
  .attr("class", "border")
  .attr("d", path);


  d3.json('/customer_location.json', function(error, locations){
    if (error){
      console.log(error);
      return;
    }

    function showPlace(place){
      for(var i = 0; i < locations.length; i++){
        if (locations[i].country == place.properties.country
          && locations[i].name == place.properties.place)
          {
            place.properties.weight = locations[i].weight;
            place.properties.ho_users = locations[i].ho_users;
            place.properties.pos_tills = locations[i].pos_tills;
            return place;
          }
      };

      return null;
    };

      var newGeoList = [];

      world.objects.places.geometries.forEach(
        function(item){
          var newItem = showPlace(item);
          if (newItem)
            newGeoList.push(newItem);
        }
      );

      world.objects.places.geometries = newGeoList;
      var places = topojson.feature(world, world.objects.places);

      g.selectAll(".place")
      .data(places.features)
      .enter().append("path")
      .attr("class", "place")
      .attr("d", path.pointRadius(function(d) {
        if (d.geometry && d.geometry.type == 'Point'){
          return radius(d.properties.weight);
        }
        else
          console.log(d);
      }))
      .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            var tip =  d.properties.ho_users + ' head office user';
            if (d.properties.pos_tills)
              tip = tip + ' and ' +d.properties.pos_tills+ ' POS tills';

            div .html(d.properties.place + '</br>' + tip)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
    })
  });

  // zoom and pan
  var zoom = d3.behavior.zoom()
  .on("zoom",function() {
    if (d3.event.scale > 1){
      if (d3.event.scale > 8){
        var transformFound = g.attr("transform").match(/translate\((.+)\)scale\((.+)\)/);
        if (transformFound){
          zoom.translate(transformFound[1].split(','));
          zoom.scale(transformFound[2]);
        }
      }
      else{
        g.attr("transform","translate("+
        d3.event.translate.join(",")+")scale("+d3.event.scale+")");
      }
    }
    else{
      g.attr('transform', null);
      zoom.translate([0, 0]);
      zoom.scale(1);
    }

  });

  svg.call(zoom)
