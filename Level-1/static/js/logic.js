//URL to get the data from
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Base Map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

// Tile Layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

//Color the markers
function colorIt(depth) {
    if (depth < 10){
      return "#FFF87F"
    }
    else if ( depth < 30){
      return "#FAFF70"
    }
    else if (depth < 50){
      return "#E3C16F"
    }
    else if (depth < 70){
      return "#BAAB68"
    }
    else if (depth < 90){
      return "#946846"
    }
    else {
      return "#6D213C"
    }
  };


// circle markers
function circleMarker(feature, latlng ){
  console.log("LatLng")
  console.log(latlng)
  console.log(feature)
  var markerOptions = {
    radius:    feature.properties.mag*5,
    fillColor: colorIt(feature.geometry.coordinates[2]),
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
  return L.circleMarker( latlng, markerOptions );
};


//Create a promise in the URL 
d3.json(url).then(function(response) {
  var earthquakes = response.features
  
  // for each record, create marker and corresponding popup
  earthquakes.forEach(function(result){
    L.geoJSON(result,{
      pointToLayer: circleMarker
    }).bindPopup("Date: " + new Date(result.properties.time) + "<br>Place: " + result.properties.place + "<br>Magnitude: " + result.properties.mag +
                  "<br>Depth: " + result.geometry.coordinates[2]).addTo(myMap)
  });

  //create legend
  var legend = L.control({position: "bottomright" });
  legend.onAdd = function(){
    // create div for the legend
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10,10,30,50,70,90]
        labels = ['<strong>Depth Scale </strong><br><br>'];

    // loop at depth intervals and generate a label with a colored square for each interval
    div.innerHTML +=labels
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorIt(grades[i]) + '"></i> ' +
            grades[i] + (grades[i +1 ] ? '&ndash;' + grades[i + 1] + '<br><br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
});
