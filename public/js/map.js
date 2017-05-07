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


//////////////////// MAP INITIALIZATION ////////////////////
function initMap() {
  // DEFAULT CENTER (Student Health and Wellness Center)
  defaultCenter = {lat: 32.879425, lng: -117.238037};


  // MAP INITIALIZATION
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,                   // default zoom level
    center: defaultCenter,      
    disableDefaultUI: true,     // disable UI buttons
    draggable: true,            // DEBUG: set to true
    maxZoom: 18,                
    minZoom: 1,                 // DEBUG: change to 1
  });


  // HEATMAP INITIALIZATION
  heatmap = new google.maps.visualization.HeatmapLayer({
    //data: getPoints(),
    data: generateRandomPoints(), // ARRAY OF POINTS TO LOAD
    map: map
  });

  changeGradient();
  changeOpacity();
  changeRadius();


  // CURRENT LOCATION MARKER INITIALIZATION
  marker = new google.maps.Marker({
    position: defaultCenter,
    icon: icon,
    map: map
  });


  // CREATE INFOWINDOW FOR ITEMS
  var infowindow = new google.maps.InfoWindow();


  // GET CURRENT LOCATION
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Print to console the coordinates of the current location
      console.log("curr lat=" + pos.lat + ", lng=" + pos.lng);

      // Center map at current location
      map.setCenter(pos);
      center = pos;














      ////////////////////// WIP /////////////////////


      map.data.loadGeoJson('https://gist.githubusercontent.com/m-chuang/b65045add0fbf8e537b654a7d383940f/raw/db46c483c82a76dd1d5d2416211d03a74fef1f87/map.geojson');

      map.data.addListener('click', function(event) {
        infowindow.setContent(event.feature.getProperty('name')+"<br>"+event.feature.getProperty('description'));
        infowindow.setPosition(event.latLng);
        infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});
        infowindow.open(map);
      });

      google.maps.event.addDomListener(window, 'load', initialize);

      ////////////////////// WIP /////////////////////

    
  }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    map.setCenter(defaultCenter);
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }



  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

  initFirebase();
}










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
// Error message for if can't gather current location
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: Ferret cannot find your location.' :
    'Error: Your browser doesn\'t support geolocation.');
     infoWindow.open(map);
}


// autoUpdate to track user location data
function autoUpdate() {
  navigator.geolocation.getCurrentPosition(function(position) {  
    var newPoint = new google.maps.LatLng(position.coords.latitude, 
                                          position.coords.longitude);

    if(errorCircle != null){
      errorCircle.setMap(null);
    }

    if (marker) {
      // Marker already created - move to current location
      marker.setPosition(newPoint);
    }
    else {
      marker = new google.maps.Marker({
        position: newPoint,
        icon: icon,
        map: map
      });
    }

    zoomLevel = map.getZoom();
    radiusVal = zoomLevel*6;

    errorCircle = new google.maps.Circle({
      strokeColor: '#1976D2',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#1976D2',
      fillOpacity: 0.35,
      map: map,
      center: newPoint,
      // TODO: zoom*val = radius for zoom in/out
      radius: radiusVal
    })


    // Centering map in new position
    //map.setCenter(newPoint);
  });

  // Calling autoUpdate every second
  setTimeout(autoUpdate, 1000);
}
autoUpdate();


// Get sample map data points (used for the Heatmap)
function getPoints() {
  var pointsArr = [
    new google.maps.LatLng(32.8796116,-117.2358329),
    new google.maps.LatLng(32.8818006,-117.2335235),
    new google.maps.LatLng(32.8818006,-117.2335235),
    new google.maps.LatLng(32.8917558,-117.241156),
    new google.maps.LatLng(32.878178205413782,-117.237203613930447),
    new google.maps.LatLng(32.8747486,-117.242025799999979),
    new google.maps.LatLng(32.8747486,-117.242025799999979),
    new google.maps.LatLng(32.879713,-117.2365667),
    new google.maps.LatLng(32.8917558,-117.241156),
    new google.maps.LatLng(32.8841462,-117.2428555),
    new google.maps.LatLng(32.8832821,-117.2387677),
  ];
  console.log(pointsArr);
  return pointsArr;
}

// generate random points as sample data
function generateRandomPoints(){
	var randomPoints = [];
	for( var i = 0; i < 1000; i++){
    var lat = 32.87 + randomIntFromInterval(0,1);
    var lng = -117.24  +randomIntFromInterval(0,1);
    console.log("LAT:" + lat + " LNG:" + lng);  
		randomPoints.push(new google.maps.LatLng(lat,lng));
    randomPoints.push(new google.maps.LatLng(lat,lng));
    randomPoints.push(new google.maps.LatLng(lat,lng));
	}
  console.log(randomPoints);
	return randomPoints;
}

// helper for generating a random number
function randomIntFromInterval(min,max)
{
   return Math.random()/100;
}

// change the gradient of the heatmap to a "reverse" heatmap
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

// change the opacity of the whole heatmap
function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.55);
}

// change the radius of a heatmap point
function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 15);
}
