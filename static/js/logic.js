
function circleSize(size){
    // size_outcome = size * 30000;
    return size * 30000;
}

function circleColor(depth){
    var color="#FFEDA0"
    // https://www.w3schools.com/js/js_switch.asp
    // Link above explains how switch does... 
    switch(true) {
    case (depth <= 10):
        // https://www.w3schools.com/colors/colors_names.asp 
        // link above is color list
        color="#7FFF00";
        break;
    case (depth <= 30):
        color="#ADFF2F"
        break;
    case (depth <= 50):
        color="#FFFF00";
        break;
    case (depth <= 70):
        color="#FFA500";
        break;
    case (depth <= 90):
        color="FF4500";
        break;
    case (90 < depth):
        color="#FF0000";
        break;
        }
    return color;
}

d3.json(url, function(data){
    // circle relies on a list known as earthquakes
var earthquakes = []
data.features.forEach(request => {
    //  [1] is the latitude, [0] is the longtitude... the third number is the depth of the earth quake size
    var latitude=request.geometry.coordinates[1];
    var longtitude=request.geometry.coordinates[0];



        earthquakes.push(
            L.circle([latitude, longtitude], {
                // https://www.geeksforgeeks.org/p5-js-stroke-function/
                // Stroke false will determine there is no stroke default size and color
                stroke: false,
                // https://canvasjs.com/docs/charts/chart-options/data/fill-opacity/
                // fillOpacity determines how strong do you want the coloring... the higher, the more solid and more non-visible. The less, the more visible of whats behind the chart/graph/image
                fillOpacity: 0.8,
                // Determines the color depending on its depth (the third value in the coordinates)
                fillColor: circleColor(request.geometry.coordinates[2]),
                // circle_depthSize will get convert the number from request.properties.mag as 30000 * num to make its size bigger to show on map
                radius: circleSize(request.properties.mag)
                // http://bl.ocks.org/mapsam/6175692 ... Example of bindPopup and how it works
                // What bindPopup does is show the marker or circle of its infomration when you click on it
                // In this code, it will had a popup for the circles 
                                                                            // https://dev.to/swarnaliroy94/the-keyword-new-in-javascript-fh6
                                                                            // example of new... new is a way to avoid creating an empty dic. to pass a function
            }).bindPopup("<h3>" + request.properties.place + "</h3><hr><p>" + new Date(request.properties.time) + "</p>",{
                maxWidth: 560
            }
            )
            
        )

    });


    // Layer out of the circles (assumed that 'earthquakes' is pushed with a new list)
    var earthquake_layers = L.layerGroup(earthquakes);

    // Our layers 
    // documenation: https://docs.mapbox.com/api/maps/static-tiles/


    // The link below is the styles... this will determine what kind of layer you want to show. If you want outdoors, you do an outdoor-
    // https://docs.mapbox.com/api/maps/styles/
    // For an example... for style of mapbox streets: mapbox://styles/mapbox/streets-v11
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
        aatribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 510,
        maxZoom: 17,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });


    var dark_map_layer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        aatribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 510,
        maxZoom: 17,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });

    var outmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        aatribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 510,
        maxZoom: 17,
        zoomOffset: -1,
        id: "mapbox/outdoors-v10",
        accessToken: API_KEY    
    });

    var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        aatribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 510,
        maxZoom: 17,
        zoomOffset: -1,
        id: "mapbox/satellilite-v8",
        accessToken: API_KEY    
    })

    // Define a baseMaps object to hold our base layers
    // this will be the circle button legend
        var baseMaps = {
        "Dark Map": dark_map_layer,
        "Outdoors Map": outmap,
        "Satellite Map": satmap,
        "Street Map": streetmap
        };

    // Grabbing the geoJSON data for the tectonic plates
    d3.json(url_2, function(data_2){
        // url_2 will have information of plates
        var plates_info = L.geoJson(data_2);

        var overlayMaps = {
            // this is the other part of legend... this will be the squares button in the legend
            "Earthquakes": earthquake_layers,
            "Tectonic Plates": plates_info
        };

        var myMap = L.map("map", {
            center:[40, -110],
            zoom: 4,
            layers:[dark_map_layer, earthquake_layers, plates_info]
        });

        L.control.layers(baseMaps, overlayMaps, {

            collapsed: false

        }).addTo(myMap);

        var info = L.control({
            position: "topright"

        });
        // to create our legend... also add a section into the html as "div" where we have classes in the "div"
        // 
        info.onAdd = function() {
            // https://www.tabnine.com/code/javascript/functions/leaflet/DomUtil            // Link describes what DomUtil executes... 
            var div = L.DomUtil.create("div", "legend");
            div.innerHTML=[
                "<h2> <u> Depth (km)</u> </h2>",
                "<p class='depth_10'>Less than and equal to 10</p>",
                "<p class='depth_30'> <b> Between 10 and equal to 30 </b> </p>",
                "<p class='depth_50'> <b> Between 30 and equal to 50 </b> </p>",
                "<p class='depth_70'>Between 50 and equal to 70</p>",
                "<p class='depth_90'>Between 70 and equal to 90</p>",
                "<p class='depth_greater90'>Greater than 90</p>"
            ].join("");


            return div;
        };
        // add info add on to the myMap to show legend
        // if no info.addTo(myMap), legend does not show
        info.addTo(myMap);

        // colorblind mode for users
        var colorBlind = L.control({
            position: "topleft"
        });

        colorBlind.onAdd = function() {
            var x = L.DomUtil.create("button", "legend");
            x.innerHTML=[
                "<p class='color_toggle'> Color Blind Toggle </p>"
            ].join("");

            return x; 
        };

        colorBlind.addTo(myMap);




    })
});
