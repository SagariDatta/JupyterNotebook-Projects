/* ---- REFERENCE ---- */
//Main resource referenced for the midterm - Leaflet library (https://leafletjs.com)

/* ---- LEAFLET CONFIGURATION ---- */
//Style used CartoDB.DarkMatter and CartoDB.Positron - https://leaflet-extras.github.io/leaflet-providers/preview/
var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
 subdomains: 'abcd',
 maxZoom: 19
})
var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

//Display basemaps
var map = L.map('map', {
  center: [39.9719438,-75.0752463], //39.9526, -75.1652
  zoom: 11,
  layers: [CartoDB_DarkMatter, CartoDB_Positron]
});

//Display interactive basemap display options using Leaflet control.layers function
L.control.layers({
    "CartoDB.DarkMatter": CartoDB_DarkMatter,
    "CartoDB.Positron": CartoDB_Positron
}).addTo(map);


/* ---- GET THE DATA ---- */
//Get API data for 311 service requests calls from opendataphilly.org - https://cityofphiladelphia.github.io/carto-api-explorer/#public_cases_fc
//Please note that I have used data points for half the month of March since the dataset is very large

//URLs for the different types of 311 service requests between 03/01/2019 - 03/15/2019
var abandonedLotsURL = "https://phl.carto.com/api/v2/sql?q=SELECT * FROM public_cases_fc WHERE service_name = 'Vacant Lot Clean-Up' AND requested_datetime >= '2019-03-01' AND requested_datetime < '2019-03-15'"
var infestationURL = "https://phl.carto.com/api/v2/sql?q=SELECT * FROM public_cases_fc WHERE service_name = 'Infestation Residential' AND requested_datetime >= '2019-03-01' AND requested_datetime < '2019-03-15'"
var trashURL = "https://phl.carto.com/api/v2/sql?q=SELECT * FROM public_cases_fc WHERE service_name = 'Sanitation / Dumpster Violation' AND requested_datetime >= '2019-03-01' AND requested_datetime < '2019-03-15'"
var treesURL = "https://phl.carto.com/api/v2/sql?q=SELECT * FROM public_cases_fc WHERE service_name = 'Street Trees' AND requested_datetime >= '2019-03-01' AND requested_datetime < '2019-03-15'"
var lightsURL = "https://phl.carto.com/api/v2/sql?q=SELECT * FROM public_cases_fc WHERE service_name = 'Street Light Outage' AND requested_datetime >= '2019-03-01' AND requested_datetime < '2019-03-15'"

//Census tract data with socio-economic features obtained from https://www.opendataphilly.org/dataset/dvrpc-2015-indicators-of-potential-disadvantage
//The dataset link on opendataphilly.org was not working on my mac - there was a CORS error despite enabling chrome extensions that should have taken care of the error
//Therefore, I downloaded the dataset and then pushed it to github and used the raw data
var tractsURL = "https://raw.githubusercontent.com/SagariDatta/Portfolio-Projects/master/MUSA611_Midterm/Tracts.geojson.json"
//var tractsURL = "https://raw.githubusercontent.com/SagariDatta/Midterm_MUSA611_Spring2019/master/Tracts.geojson.json?token=AZgckAcesxDtDzujiGYbNAwQBwtpcIPhks5cs6MtwA%3D%3D"
//R geojson output file - service request aggregated to census tracts
var tracts_summ = "https://raw.githubusercontent.com/SagariDatta/test/master/tractsPoly.geojson"


/* ---- ORGANIZE INFORMATION FOR DIFFERENT SLIDES ---- */
//Create slide array to organize slide info for each slide
var slide_array = [
  {"slide_num": 1,
  "subheading": "Introduction",
  "text": "311 service request calls can be a useful source of information to determine how neighborhoods fare on certain urban quality of life indicators. For this story map, four different types of 311 service requests calls for the month of March 2019 in Philadelphia were mapped over census tracts with low income households to find out if lower income neighborhoods were more affected than other areas.",
  "url": tractsURL},

  {"slide_num": 2,
  "subheading": "Vacant Lots",
  "text": "This map shows the number of complaints made related to vacant/abandoned lots. The data suggests that these complaints were mostly centered around low income tracts in the center city area of Phildelphia. Furthermore, most of these complaints are open and yet to be resolved.",
  "url": abandonedLotsURL},

  {"slide_num": 3,
  "subheading": "Building Infestation",
  "text": "The complaints related to building infestation were relatively fewer. However, most of the complaints are still open and yet to be resolved.",
  "url": infestationURL},

  {"slide_num": 4,
  "subheading": "Sanitation/Trash Complaints",
  "text": "Sanitation and trash related complaints were mostly made in the low income tracts of the city. However, the only exception were some higher income tracts in Southeast Philadelphia. Moreover, most of the sanitation related complaints were closed.",
  "url": trashURL},

  {"slide_num": 5,
  "subheading": "Street Light Outage",
  "text": "Street light outage seems to be a common complaint throughout Phildelphia. From the map we can see that street light outage complaints were made in both low income and high income census tracts. However, most of the complaints are open and yet to be resolved.",
  "url": lightsURL}
];

//Functions to add text information to slides
var slideSubheading = function(slide_counter){
  //add subheading
  return $("#subheading").html(slide_array[slide_counter-1]["subheading"]);
};
var slideText = function(slide_counter){
  //add text
  return $("#text").html(slide_array[slide_counter-1]["text"]);
};


/* ---- MAP SHOWING CENSUS TRACTS WITH HOUSEHOLDS BELOW POVERTY LINE ---- */
//Create variable for feature collection
var featureGroup;

//Function to set color for census tracts based on the number of households that are living in poverty
//Classification based on quantiles (3 groups). Calculated in R using the quantile function
//Color scheme determnined using Color Brewer - http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3
function getColor(d) {
    return d > 258 ? '#3182bd' :
           d > 127 ? '#9ecae1' :
           d > 60 ?  '#b4d0ea': //'#deebf7'
                    '#ffffff00'; //Some areas in Philly don't have a census tract ID - those areas have been set to transperant
};

//Function for styling feature display
var myStyle = function(feature) {
  return {
    fillColor: getColor(feature.properties.POVHH),
    fillOpacity: .6,
    color: getColor(feature.properties.POVHH),
    weight: .5,
    opacity: 1
  };
};

//Function to filter Philadelphia county. Note: the GeoJSON dataset included census tracts for the entire DVRPC Region.
var myFilter = function(feature) {
  //Filtering out for just philadelphia county
  if (feature.properties.COUNTYFP10 == 101) {
    return true;
  }
};

//Function to get census tract data and add to map
var getFeatureData = function(url) {
  $.ajax(url).done(function(res) {
      var data = JSON.parse(res);
      console.log(data);
      featureGroup = L.geoJson(data, {
        style: myStyle,
        filter: myFilter
      }).addTo(map);
  });
};

//Display census tract (households below poverty line) legend on leaflet map
//Code referenced from leaflet library example - https://leafletjs.com/examples/choropleth/
var legend1 = L.control({position: 'bottomright'});
legend1.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [258, 127, 60],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '');
    }
    return div;
};


/* ---- MAP FOR DIFFERENT SERVICE REQUESTS ---- */
//Function to specify marker color for each service request type
function getMarkerColor (slide_counter) {
  if (slide_counter == 2){
    return "#47b534";
  }
  else if (slide_counter == 3) {
    return "#e28f41";
  }
  else if (slide_counter == 4) {
    return "#aa5c6f";
  }
  else if (slide_counter == 5){
    return "#e0cf6d";
  }
};

//Function to style markers
var markerStyleOpen = function (slide_counter) {
  //Call getMarkerColor function to get fill color
  var color = getMarkerColor(slide_counter);
  //return the dictionary object for marker style to be applied
  return {
  radius: 9, //radius of circle markers bigger for opened service requests
  fillColor: color,
  color:'#ffffff00',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.45
  };
};

//Function to style markers
var markerStyleClosed = function (slide_counter) {
  //Call getMarkerColor function to get fill color
  var color = getMarkerColor(slide_counter);
  //return the dictionary object for marker style to be applied
  return {
  radius: 2, //radius of circle markers smaller for closed service requests
  fillColor: color,
  color:'#ffffff00',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.5
  };
};

//Function to get service request data
var displayOnMap = function(slide_counter) {
  var url = slide_array[slide_counter-1]["url"];
  console.log(url);
  $.ajax(url).done(function(res) {
      //URL data already in JSON format - no need to parse
      var data =  res;
      //console.log(data);
      _.forEach(data.rows, function(point) {
        //console.log(point);
        //Filter out features that don't have lat/long values
        if (point.lon != " " && point.lat != " ") {
          //If status is 'Opened', markers are bigger
          if (point.status == "Open" ){
            servicelayer = L.circleMarker([point.lat, point.lon], markerStyleOpen(slide_counter)).addTo(map);
          }
          //If status is 'Opened', markers are smaller
          else {
            servicelayer = L.circleMarker([point.lat, point.lon], markerStyleClosed(slide_counter)).addTo(map);
          }
        }
      });
  });
};


/* ---- SLIDE DISPLAY ---- */
//Setting values for the different slide variables
var slide_counter = 1; //a slide counter variable to keep tract of the no. of slides
var min_slide_num = 1; //the minimum no. of slides
var max_slide_num = 5; //the maximum no. of slides

//State of buttons for the intro slide outside of the button clicked event function
if(slide_counter == 1) {
  $("#next").show();
  $("#prev").hide();
  $("#text1").show();
  slideSubheading(slide_counter);
  slideText(slide_counter);
  getFeatureData(tractsURL);
  legend1.addTo(map);
  //Interactive features (midterm requirement) - setMaxBounds and setview for - applied to all layers
  //map.setMaxBounds(map.getBounds());
  //map.setView([20,20]);
}

//If next button clicked then...
$("#next").click(function(event){
  //1 will be added to slide counter until it reaches the max no. of slides
  if (slide_counter < max_slide_num+1) {
    slide_counter += 1;
    console.log(slide_counter);
  }
  if (slide_counter == 1) {
    //show only next button if on slide 1
    $("#next").show();
    $("#prev").hide();
  }
  else if (slide_counter == 2) {
    //Show next and previous buttons if on slide 2,3,4
    $("#next").show();
    $("#prev").show();
    //Show open, closed and service request headings
    $("#open").show();
    $("#closed").show();
    $("#request").show();
    //Show legend for vacant lots
    $("#largeCircle2").show();
    $("#smallCircle2").show();
    $("#req2").show();
    //Show text for each slide
    slideSubheading(slide_counter);
    slideText(slide_counter);
    //Display service request points on map
    displayOnMap(slide_counter);
  }
  else if (slide_counter == 3) {
    //Show next and previous buttons if on slide 2,3,4
    $("#next").show();
    $("#prev").show();
    //Show legend for building infestation
    $("#largeCircle3").show();
    $("#smallCircle3").show();
    $("#req3").show();
    //Show text for each slide
    slideSubheading(slide_counter);
    slideText(slide_counter);
    //Display service request points on map
    displayOnMap(slide_counter);
  }
  else if (slide_counter == 4) {
    //Show next and previous buttons if on slide 2,3,4
    $("#next").show();
    $("#prev").show();
    //Show legend for sanitation complaints
    $("#largeCircle4").show();
    $("#smallCircle4").show();
    $("#req4").show();
    //Show text for each slide
    slideSubheading(slide_counter);
    slideText(slide_counter);
    //Display service request points on map
    displayOnMap(slide_counter);
  }
  else {
    //Show only prev button if on slide 5
    $("#next").hide();
    $("#prev").show();
    //Show legend for street light outages
    $("#largeCircle5").show();
    $("#smallCircle5").show();
    $("#req5").show();
    //Show text for each slide
    slideSubheading(slide_counter);
    slideText(slide_counter);
    //Display service request points on map
    displayOnMap(slide_counter);
  }
});

//If prev button clicked then...
$("#prev").click(function(event){
  //1 will be subtracted to slide counter until it reaches the min no. of slides
  if (slide_counter > min_slide_num) {
    slide_counter -= 1;
    console.log(slide_counter);
  }
  if (slide_counter == 1) {
    //Show only next button if on slide 1
    $("#next").show();
    $("#prev").hide();
    $("#text1").show();
    //Show text for each slide
    slideSubheading(slide_counter);
    slideText(slide_counter);
  }
  //Show next and previous buttons if on slide 2,3,4
  else if (slide_counter == 2 || slide_counter == 3 || slide_counter == 4) {
    $("#next").show();
    $("#prev").show();
    //Show text for each slide
    slideSubheading(slide_counter);
    slideText(slide_counter);
    //Display service request points on map
    displayOnMap(slide_counter);
  }
  else {
    //Show only prev button if on slide 5
    $("#next").hide();
    $("#prev").show();
    //Show text for each slide
    slideSubheading(slide_counter);
    slideText(slide_counter);
    //Display service request points on map
    displayOnMap(slide_counter);
  }
});
