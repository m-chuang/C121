// SHARED VARIABLES
var map;
var defaultCenter;
var marker;
var icon = "/images/avatar/Ferret.png";
var heatmap;
var GeoMarker;
var errorCircle;
var center;
var zoomLevel;
var randomPoints;

// HEATMAP AND FIREBASE - location 
var prev_lat = 0;
var prev_lng = 0;
var data = {
  sender: null,
  //timestamp: null,
  lat: null,
  lng: null
 
};
var database;
var refPoints;
var sender;
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
    //disableDefaultUI: true,     // disable UI buttons
    streetViewControl: false,   // disable Street View
    clickableIcons: false,      // disable default Google POIs
    draggable: true,            // DEBUG: set to true
    maxZoom: 18,                // DO NOT CHANGE
    //minZoom: 18,                // DEBUG: change to 1
  });


  // HEATMAP INITIALIZATION
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: loadPoints(),  // ARRAY OF POINTS TO LOAD
    map: map
  });

  changeGradient();
  changeOpacity();
  changeRadius();
  
  // Get Data URL for avatar ferret //
  // Load images by URL onto the canvas
  var virtualCanvas = document.createElement("CANVAS");
  virtualCanvas.height = "284";
  virtualCanvas.width = "486";
  var ctx = virtualCanvas.getContext("2d");
  var avatarDataUrl;

  function loadImg(imgUrl) {
    var imgObj = new Image();
    var newString = String(imgUrl);
    imgObj.src = newString;

    imgObj.onload = function() {
      ctx.drawImage(imgObj, 0, 0);
      avatarDataUrl = virtualCanvas.toDataURL();
      // FERRET IMAGE PROPERTIES
      icon = {
        url: avatarDataUrl.toString(),
        scaledSize: new google.maps.Size(160, 100), // scaled smaller
        origin: new google.maps.Point(0, 0),
        //anchor: new google.maps.Point(100, 50) // change the anchor point of the image
      };

      // CURRENT LOCATION MARKER INITIALIZATION (FERRET IMAGE)
      marker = new google.maps.Marker({
        position: defaultCenter,
        icon: icon,
        map: map
      });
    }
  }

  // Virtually put on the avatar to make the ferret avatar
  loadImg("/images/avatar/Ferret.png");
  loadImg("/images/avatar/hats/PropellerHat.png");
  loadImg("/images/avatar/shirts/GreenStripeShirt.png");
  loadImg("/images/avatar/shoes/BlueSocks.png"  );


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
  database = firebase.database();
  refPoints = database.ref('points');
   // FIREBASE
  const lg_signout = document.getElementById('lg_signout');

  lg_signout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

   firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
          console.log(firebaseUser);

          // console.log(firebase.child);
          sender = data.sender = firebaseUser.uid;
          //console.log(data.sender);
          
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

  //var user = firebase.auth().currentUser;
  //
  //console.log(randomPoints);
  return randomPoints;
}
//////////////////// Prev Location Points Loader ////////////////

function loadPoints() {
  randomPoints = new google.maps.MVCArray([]);
  refPoints.on('value', getPoints, errData);
  return randomPoints;
}

function getPoints(data) {
  console.log(data.val());
  var points = data.val();
  var keys = Object.keys(points);
  var currentPoint = marker.getPosition();
  var c_lat = currentPoint.lat();
  var c_lng = currentPoint.lng();

  for (var i = 0 ; i < keys.length; i++) {

    var k = keys[i];
    console.log(sender);
    console.log(points[k].sender);

    if(points[k].sender == sender) {
      console.log("GOT HERE!");
      
      var lat = points[k].lat;
      var lng = points[k].lng;

      if ((Math.abs(c_lat - lat ) <= 0.01 || Math.abs(c_lng - lng) <= 0.01)) {
        prev_lat = c_lat;
        prev_lng = c_lng;
      }
      randomPoints.push(new google.maps.LatLng(lat,lng));
    }
  }
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}
//////////////////// LOCATION POINTS Updater ////////////////////
function updatePoints(){
  var currentPoint = marker.getPosition();
  
  
  if ((Math.abs(currentPoint.lat() - prev_lat ) > 0.0001 || Math.abs(currentPoint.lng() - prev_lng) > 0.0001)) { //} || (count < 3))  {
    console.log("GOT HERE TOO!")
    randomPoints.push(new google.maps.LatLng(currentPoint.lat(),currentPoint.lng()));
    prev_lat = currentPoint.lat();
    prev_lng = currentPoint.lng();

    // Add point to firebase
    data.lat = prev_lat;
    data.lng = prev_lng;

    refPoints.push(data);
   /* var ref = firebase.push(data, function(err) {
      if (err) {  // Data was not written to firebase.
        console.warn(err);
      }
    });*/

    //count = 0;

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