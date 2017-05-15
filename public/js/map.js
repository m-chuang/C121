// SHARED VARIABLES
var map;
var defaultCenter;
var marker;
var icon = "/images/ferret0.png";
var heatmap;
var GeoMarker;
var errorCircle;
var center;
var zoomLevel;
var randomPoints;

// HEATMAP AND FIREBASE - location 
var prev_lat = 0;
var prev_lng = 0;
var curr_lat;
var curr_lng;
var count = 0;

//////////////////// CONTINUOUSLY UPDATE LOCATION ////////////////////
autoUpdate();



//////////////////// MAP INITIALIZATION ////////////////////
function initMap() {
  // DEFAULT CENTER (Student Health and Wellness Center)
  defaultCenter = {lat: 32.879425, lng: -117.238037};


  // MAP INITIALIZATION
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,                   // default zoom level
    center: defaultCenter,      // center map at default location
    disableDefaultUI: true,     // disable UI buttons
    clickableIcons: false,      // disable default Google POIs
    draggable: false,            // DEBUG: set to true
    maxZoom: 18,                // DO NOT CHANGE
    minZoom: 18,                // DEBUG: change to 1
  });


  // HEATMAP INITIALIZATION
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: generateRandomPoints(), // ARRAY OF POINTS TO LOAD
    map: map
  });

  changeGradient();
  changeOpacity();
  changeRadius();
  
  // FERRET IMAGE PROPERTIES
  icon = {
    url: "/images/ferret0.png",
    scaledSize: new google.maps.Size(100, 50), // scaled smaller
    origin: new google.maps.Point(0, 0),
    //anchor: new google.maps.Point(100, 50) // change the anchor point of the image
  };

  // CURRENT LOCATION MARKER INITIALIZATION (FERRET IMAGE)
  marker = new google.maps.Marker({
    position: defaultCenter,
    icon: icon,
    map: map
  });


  // GET CURRENT LOCATION
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Print to console the coordinates of the current location
      console.log("curr lat=" + pos.lat + ", lng=" + pos.lng);

      // CLEAR HEATMAP AT CURRENT LOCATION (MAYBE - given it's undiscovered location)
      updatePoints();    

      // Center map at current location
      map.setCenter(pos);
      center = pos;

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } 
  else {
      // Center at default location
      map.setCenter(defaultCenter);
      handleLocationError(false, infoWindow, map.getCenter());
  }


  // CREATE INFOWINDOW FOR ITEMS
  var infowindow = new google.maps.InfoWindow();

  // ITEM HANDLING
  map.data.loadGeoJson('https://gist.githubusercontent.com/m-chuang/b65045add0fbf8e537b654a7d383940f/raw/bd352f28714d7d3d41666f7683a46ea51f1bed72/map.geojson');

  map.data.addListener('click', function(event) {
    infowindow.setPosition(event.latLng);
    infowindow.setContent(event.feature.getProperty('name')+"<br /> <br />"+event.feature.getProperty('description')+"<br /> <br />"+'<center><button onclick="infowindow.close();">Pick Up Item</button></center>');
    infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});
    infowindow.open(map);
  });

  // CLOSE ITEM INFOWINDOW ON CLICKAWAY
  google.maps.event.addListener(map, "click", function(event) {
      infowindow.close();
  });


  // CREATE CENTER AT LOCATION BUTTON
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);


  // RECENTER MAP ON WINDOW RESIZE
  google.maps.event.addDomListener(window, "resize", function() {
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
  });



}

  // INITIALIZE FIREBASE
  initFirebase();

//////////////////// LOCATION UPDATER ////////////////////
function autoUpdate() {
  navigator.geolocation.getCurrentPosition(function(position) {  
    var newPoint = new google.maps.LatLng(position.coords.latitude, 
                                          position.coords.longitude);

    // LOCATION MARKER UPDATER
    if (marker) {
      marker.setPosition(newPoint);

    }
    else {
      marker = new google.maps.Marker({
        position: newPoint,
        icon: icon,
        map: map
      });
    }


    // ERROR RANGE UPDATER
    /*
    if(errorCircle){
      errorCircle.setMap(null);
    }
    else {
      errorCircle = new google.maps.Circle({
        strokeColor: '#1976D2',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#1976D2',
        fillOpacity: 0.35,
        map: map,
        center: newPoint,
        radius: 100
    })
    }
    */

  });

  // UPDATE EVERY SECOND
  setTimeout(autoUpdate, 1000);
  setTimeout(updatePoints, 5000);
}



//////////////////// LOCATION ERROR HANDLING ////////////////////
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: Ferret cannot find your location.' :
    'Error: Your browser doesn\'t support geolocation.');
     infoWindow.open(map);
}



//////////////////// CENTER AT LOCATION CONTROLS ////////////////////
function CenterControl(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Center at Current Location';
  controlUI.appendChild(controlText);

  // Setup the click event listeners.
  controlUI.addEventListener('click', function() {
    map.setCenter(center);
  });
}



//////////////////// FIREBASE INITIALIZATION ////////////////////
function initFirebase() {
  var config = {
    apiKey: "AIzaSyD3R60ccA0wuNN40tV_aLPGQZl4yrUjcTQ",
    authDomain: "ferret-82825.firebaseapp.com",
    databaseURL: "https://ferret-82825.firebaseio.com",
    projectId: "ferret-82825",
    storageBucket: "ferret-82825.appspot.com",
    messagingSenderId: "285929520709"
  };
  
  firebase.initializeApp(config);

   // FIREBASE
  const lg_signout = document.getElementById('lg_signout');

  lg_signout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

   firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
          console.log(firebaseUser);
          
        } else {
          console.log('not logged in');
          window.location = './';
        }
    });
}



//////////////////// LOCATION POINTS GENERATOR ////////////////////
function generateRandomPoints(){
  //var prevPoints= [];
  randomPoints = new google.maps.MVCArray([]);
  for( var i = 0; i < 100; i++){

    // ORIGINAL
    //var lat = 32.87 + randomIntFromInterval(0,1);
    //var lng = -117.24  +randomIntFromInterval(0,1);

    // NEW
    var lat = 32.874 + randomIntFromInterval(0,2);
    var lng = -117.242  +randomIntFromInterval(0,2);
    //console.log("LAT:" + lat + " LNG:" + lng);  
    randomPoints.push(new google.maps.LatLng(lat,lng));
    randomPoints.push(new google.maps.LatLng(lat,lng));
    randomPoints.push(new google.maps.LatLng(lat,lng));
  }
  console.log(randomPoints);
  return randomPoints;
}

//////////////////// LOCATION POINTS Updater ////////////////////
function updatePoints(){
  var currentPoint = marker.getPosition();
  
  
  if ((Math.abs(currentPoint.lat() - prev_lat ) > 0.0001 || Math.abs(currentPoint.lng() - prev_lng) > 0.0001)) { //} || (count < 3))  {

    randomPoints.push(new google.maps.LatLng(currentPoint.lat(),currentPoint.lng()));
    prev_lat = currentPoint.lat();
    prev_lng = currentPoint.lng();
    count = 0;

    //console.log(prev_lat);
  }
}


function randomIntFromInterval(min,max)
{
   return Math.random()/100;
}



//////////////////// HEATMAP FUNCTIONS ////////////////////
// CHANGE GRADIENT TO 'REVERSE' HEATMAP
function changeGradient() {
  var gradient = [
    'rgba(49, 197, 57, 1)', // default green overlay
    'rgba(24, 181, 74, 0.8)',
    'rgba(24, 181, 74, 0.6)',
    'rgba(24, 181, 74, 0.4)',
    'rgba(24, 181, 74, 0.2)',
    'rgba(49, 197, 57, 0)',
    'rgba(49, 197, 57, 0)',
    'rgba(49, 197, 57, 0)',
    'rgba(49, 197, 57, 0)',
    'rgba(49, 197, 57, 0)',
    'rgba(49, 197, 57, 0)',
    'rgba(49, 197, 57, 0)',
    'rgba(49, 197, 57, 0)',
    'rgba(255, 255, 255, 0)' // clear
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}


// CHANGE OPACITY OF HEATMAP
function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.55);
}


// CHANGE RADIUS OF HEATMAP POINTS
function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 75);
}