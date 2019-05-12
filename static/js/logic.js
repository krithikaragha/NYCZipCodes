// Create a map object
var map = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 14
});

// Add a tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

var url = "http://data.beta.nyc//dataset/3bf5fb73-edb5-4b05-bb29-7c95f4a727fc/resource/" +
"6df127b1-6d04-4bb7-b983-07402a2c3f90/download/f4129d9aa6dd4281bc98d0f701629b76nyczipcodetabulationareas.geojson";

// Function to determine what the color of a neighborhood will be
function chooseColor(borough) {
    switch(borough) {
        case "Manhattan":
            return "red";
        case "Brooklyn": 
            return "yellow";
        case "Queens":
            return "green";
        case "Bronx":
            return "orange";
        case "Staten Island":
            return "blue";
        default:
            return "black";
    }
}

// Grab the GeoJSON data
d3.json(url, function(data) {

    // Create a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // Style each feature (in this case each zipcode neighborhood)
        style: function(feature) {
            return {
                color: "white",
                // Call chooseColor() function to decide which color to fill in for each neighnorhood based on the borough
                fillColor: chooseColor(feature.properties.borough),
                fillOpacity: 0.75,
                weight: 1.5
            };
        },

        // Called on each feature
        onEachFeature: function(feature, layer) {
            // Add the zipcode to each polygon on the map
            var zipcodeLabel = "<h4>" + feature.properties.postalCode + "</h4>";
            var label = L.marker(layer.getBounds().getCenter(), {
                icon: L.divIcon({
                    className: 'label',
                    html: zipcodeLabel,
                    bgPos: [100, 40],
                })
            }).addTo(map);

            // Add mouseover event to change opacity to 90% on hover
            layer.on({
                mouseover: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                    // Give each feature a popup with information pertaining to it
                    layer.bindPopup("<h1>" + feature.properties.postalCode + "</h1><hr> <h2>" + feature.properties.borough + "</h2>");
                }
            });
        }
    }).addTo(map);
});