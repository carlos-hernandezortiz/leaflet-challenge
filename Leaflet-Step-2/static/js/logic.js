

 //get the url for the earthquake data
 var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=" +
 "2019-01-02&maxlongitude=150.52148437&minlongitude=-150.83789062&maxlatitude=80.74894534&minlatitude=-70.7433195";
 
 // Perform a GET request to the query URL
 d3.json(queryUrl, function(data) {
   // Once we get a response, send the data.features object to the createFeatures function
   createFeatures(data.features);
 });
 
 // create a function that changes marker size depending on the magnitute values
 function markerSize(mag){
   return mag * 5
 }
 
 // create a function that gets colors for circle markers
 function getColors(d) {
 if (d < 1){
   return "#B7DF5F"
 }
 else if ( d < 2){
   return "#DCED11"
 }
 else if (d < 3){
   return "#EDD911"
 }
 else if (d < 4){
   return "#EDB411"
 }
 else if (d < 5 ){
   return "#ED7211"
 }
 else {
   return "#ED4311"
 }
 };
 

 function createCircleMarker(feature, latlng ){
 
 // Change the values of these options to change the symbol's appearance
   var markerOptions = {
     radius: markerSize(feature.properties.mag),
     fillColor: getColors(feature.properties.mag),
     color: "black",
     weight: 1,
     opacity: 1,
     fillOpacity: 0.8
   }
   return L.circleMarker( latlng, markerOptions );
 };
 
 // create function that adds circles and popups to the layer
 function createFeatures(earthquakeData) {
   console.log(earthquakeData)

   //Define a function we want to run once for each feature in the features array
   //Give each feature a popup describing the place and time of the earthquake
   function onEachFeature(feature, layer) {
     layer.bindPopup("Location: " + feature.properties.place + "<br>" 
         + "Date: " + new Date(feature.properties.time) + "<br>" + "Magnitude: " + feature.properties.mag);
   }
 
   // Create a GeoJSON layer containing the features array on the earthquakeData object
   // Run the onEachFeature function to get popup for each data in the array 
   // add the circle markers with pointTolayer function
   var earthquakes = L.geoJSON(earthquakeData, {
     onEachFeature: onEachFeature,
     pointToLayer: createCircleMarker
   });
 
   // Send the earthquakes layer to the createMap function
   createMap(earthquakes);
 }
 
 //create legends and add to the map
 var legend = L.control({position: "bottomright" });
 legend.onAdd = function(){
   // create div for the legend
   var div = L.DomUtil.create('div', 'info legend'),
       grades = [0, 1, 2, 3, 4, 5]
       labels = [];
 
   // loop through our density intervals and generate a label with a colored square for each interval
   for (var i = 0; i < grades.length; i++) {
       div.innerHTML +=
           '<i style="background:' + getColors(grades[i]) + '"></i> ' +
           grades[i] + (grades[i +1 ] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
   }
   return div;
 };
 


 // create the function that cretes the map and adds the layers to the map
 function createMap(earthquakes) {
 
   // Define streetmap and darkmap layers
   var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
     maxZoom: 18,
     id: "mapbox.outdoors",
     accessToken: API_KEY
   });
 
   var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
     maxZoom: 18,
     id: "mapbox.light",
     accessToken: API_KEY
   });

   var grayscale = L.tileLayer.grayscale('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>", 
    maxZoom: 18,
    });
 
   var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  })

   // Define a baseMaps object to hold our base layers
   var baseMaps = {
     "Light Map": light,
     "Outdoors": outdoors,
     "Satellite" : satellite,
     "Grayscale" : grayscale
   };
 
   // Create overlay object to hold our overlay layer
   var overlayMaps = {
     Earthquakes: earthquakes,
   };
 
   // Create our map, giving it the streetmap and earthquakes layers to display on load
   var myMap = L.map("map", {
     center: [
       37.09, -95.71
     ],
     zoom: 5,
     layers: [satellite, earthquakes]
   });
 
   // Create a layer control
   // Pass in our baseMaps and overlayMaps
   // Add the layer control to the map
   L.control.layers(baseMaps, overlayMaps, {
     collapsed: false
   }).addTo(myMap);
   // add the lagend to the map
   legend.addTo(myMap);

 }
 
