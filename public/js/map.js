// SHARED VARIABLES
var map;
var defaultCenter;
var marker;
var icon = "";
var heatmap;
var GeoMarker;
var errorCircle;
var center;
var zoomLevel;
var randomPoints;
var helpinfowindow;
var currentPoint;

var infoWindow;

// HEATMAP AND FIREBASE - location 
var prev_lat = 0;
var prev_lng = 0;

var user;
var point_data = {
  lat: null,
  lng: null
}
// Will store item data -- stored in refItems
var item_data = {
  item0: 0,
  item1: 0,
  item2: 0,
  item3: 0,
  item4: 0,
  item5: 0,
  item6: 0,
  item7: 0,
  item8: 0,
  item9: 0,
  item10: 0,
  item11: 0,
  item12: 0,
  item13: 0,
  item14: 0,
  item15: 0,
}

// Item map
var item_map = {
  CowboyHat: 0,
  PropellerHat: 1,
  GraduationCap: 2,
  MagicalHat: 3,
  SunHat: 4,
  TopHat:5, 
  BabyBlueShirt: 6,
  BlueShirtWhiteTrim: 7,
  GreenStripeShirt: 8,
  LeatherShirtWhiteTrim: 9,
  PeachPolkaDotShirt: 10,
  BlueSocks: 11,
  BrownBoots: 12,
  GreenSneakers: 13,
  RedSneakers: 14,
  RedSocks: 15
}

var avatar_items = {
  hat: 99,
  shirt: 99,
  shoes: 99
}
//var item_data = {}
var database;
var refPoints; // Will refer to the {uid}/points child in firebase
var refItems; // Will refer to the {uid}/items child in firebase
var sender;
var user_items;
var user_key;
var user_avatarItemsKey;



//////////////////// MAP INITIALIZATION ////////////////////
function initMap() {
  // DEFAULT CENTER (Student Health and Wellness Center)
  defaultCenter = {lat: 32.879425, lng: -117.238037};


  // MAP INITIALIZATION
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,                   // default zoom level
    center: defaultCenter,      // center map at default location   
    streetViewControl: false,   // disable Street View
    clickableIcons: false,      // disable default Google POIs
    zoomControl: false,         // disable zoom controls
    draggable: true,            // DEBUG: set to true
    maxZoom: 18,                // DO NOT CHANGE    
    //minZoom: 18,              // DEBUG: change to 1
    fullscreenControl: false,
    mapTypeControl: false,
    styles: terrainStyle, 
  });
  

  randomPoints = new google.maps.MVCArray([]);
  
  // HEATMAP INITIALIZATION
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: randomPoints, //loadPoints(),  // ARRAY OF POINTS TO LOAD
    maxIntensity: 3,
    map: map
  });

  changeGradient();
  changeOpacity();
  changeRadius();
  
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
    }, {maximumAge: 600000, timeout: 10000, enableHighAccuracy: true}); // Enable high accuracy - GPS
  } 
  else {
      // Center at default location
      map.setCenter(defaultCenter);
      handleLocationError(false, infoWindow, map.getCenter());
  }

  

  // CREATE INFOWINDOW FOR ITEMS
  infowindow = new google.maps.InfoWindow();

  // ITEM HANDLING
  map.data.loadGeoJson('https://gist.githubusercontent.com/ashleymp/59d075bd2ef1ba1e893a13bc5e58366f/raw/c0bcfe26065629f5d116a05baa2311aee8c89c14/mapItems.geojson');

  var itemMarkers = {
    url: "/images/mystery.png",
    scaledSize: new google.maps.Size(30, 30) // scaled smaller
  }

  map.data.setStyle({
    icon: itemMarkers
  });

  map.data.addListener('click', function(event) {
    infowindow.setPosition(event.latLng);
    infowindow.setContent("<font color=black>"+event.feature.getProperty('name')+"<br /> <br />"+event.feature.getProperty('description')+"</font>");
    //infowindow.setContent("<font color=black>"+event.feature.getProperty('name')+"<br /> <br />"+event.feature.getProperty('description')+"<br /> <br />"+'<center><button onclick="infowindow.close()"><font color=black>Pick Up Item</font></button></center>' +"</font>");
    addItem(event.feature.getProperty('item_num'));

    infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});
    infowindow.open(map);
  });

  // CLOSE ITEM INFOWINDOW ON CLICKAWAY
  google.maps.event.addListener(map, "click", function(event) {
      infowindow.close();
  });

  // MAKE ITEM DISAPPEAR ONCLICK
  map.data.addListener('click', function(event) {
     map.data.overrideStyle(event.feature, {visible: false});
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


  // CREATE HELP BUTTON
  var helpControlDiv = document.createElement('div');
  var helpControl = new HelpControl(helpControlDiv, map);

  helpControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(helpControlDiv);

  // CREATE INFOWINDOW FOR HELP
  helpinfowindow = new google.maps.InfoWindow({
    maxWidth: 350
  });

  // CLOSE HELP INFOWINDOW ON CLICKAWAY
  google.maps.event.addListener(map, "click", function(event) {
      helpinfowindow.close();
  });
}

// INITIALIZE FIREBASE
initFirebase();

//////////////////// CONTINUOUSLY UPDATE LOCATION ////////////////////
autoUpdate();


//////////////////// LOCATION UPDATER ////////////////////
function autoUpdate() {
  navigator.geolocation.getCurrentPosition(function(position) {  
    var newPoint = new google.maps.LatLng(position.coords.latitude, 
                                          position.coords.longitude);


    // LOCATION MARKER UPDATER
    if (marker) {
      marker.icon = icon;
      marker.setPosition(newPoint);
      if(!currentPoint){
        map.setCenter(newPoint);
      }

    }
    else {
      marker = new google.maps.Marker({
        position: newPoint,
        icon: icon,
        map: map
      });
    }

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
  controlUI.style.backgroundColor = 'rgba(0,0,0,0.25)';
  controlUI.style.border = '1px solid #fff';
  controlUI.style.borderRadius = '5px';
  //controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '30px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'white';
  controlText.style.fontFamily = 'Source Sans Pro,Helvetica,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '30px';
  controlText.style.paddingLeft = '10px';
  controlText.style.paddingRight = '10px';
  controlText.innerHTML = 'Recenter Map';
  controlUI.appendChild(controlText);

  // Setup the click event listeners.
  controlUI.addEventListener('click', function() {
    map.setCenter(center);
  });
}

//////////////////// HELP CONTROLS ////////////////////
function HelpControl(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  //controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '1px solid #fff';
  controlUI.style.borderRadius = '5px';
  //controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '15px';
  controlUI.style.marginRight = '20px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Help: Get Started';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'white';
  controlText.style.fontFamily = 'Source Sans Pro,Helvetica,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '30px';
  controlText.style.paddingLeft = '10px';
  controlText.style.paddingRight = '10px';
  controlText.innerHTML = 'Help';
  controlUI.appendChild(controlText);

  // Setup the click event listeners.
  controlUI.addEventListener('click', function() {
    var helpTemp = marker.getPosition();
    helpinfowindow.setPosition(helpTemp);
    helpinfowindow.setContent('<font color=black face="Source Sans Pro" size="3">Your ferret avatar marks your current location. ' 
      + 'Explore around and uncover the green grass to keep track of everywhere that you have visited. '
      + 'You may also see mystery items on the map that you can pick up and use to dress up your avatar.</font>');
    helpinfowindow.setOptions({pixelOffset: new google.maps.Size(0,-70)});
    helpinfowindow.open(map);
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
  
   // FIREBASE
  const lg_signout = document.getElementById('lg_signout');

  lg_signout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

   firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
          console.log(firebaseUser);

          // console.log(firebase.child);
          sender = firebaseUser.uid;
        
          /* LOADING USER'S POINTS */
          // Creating reference to user's points
          refPoints = database.ref(sender+"/points");
          loadPoints();

          /* LOADING USER'S ITEMS */
          // Creating reference to user's items
          refItems = database.ref(sender+"/items")
          refAvatar = database.ref(sender+"/avatar");
          // Retrieving user's items - will get saved in user_items, key will get saved in user_key
          var item1 = refItems.on('value',getItemVal,errData);
          refAvatar.on('value',getAvatarData,errData);
        
          
        } else {
          console.log('not logged in');
          window.location = './';
        }
    });
  
}

/*
  Called by refItems.on(..)
  This function retrieves the user's item data and stores it
  in global variable 'user_items' which can be used in the rest of map.js.
  It also stores the items' key in global var 'user_key', which is necessary
  to perform updates to the data.
*/
function getItemVal(data) {
  // Retrieving data if any
  var items_data = data.val();
  

  // Check if new user - has no real items reference key
  if (items_data == null)
  {
    refItems.push(item_data);
  }
  // Returning user - has items reference key
  else 
  {
    var keys = Object.keys(items_data);
    user_key = keys[0];


    //retrieve data
    user_items = {
        item0: items_data[user_key].item0,
        item1: items_data[user_key].item1,
        item2: items_data[user_key].item2,
        item3: items_data[user_key].item3,
        item4: items_data[user_key].item4,
        item5: items_data[user_key].item5,
        item6: items_data[user_key].item6,
        item7: items_data[user_key].item7,
        item8: items_data[user_key].item8,
        item9: items_data[user_key].item9,
        item10: items_data[user_key].item10,
        item11: items_data[user_key].item11,
        item12: items_data[user_key].item12,
        item13: items_data[user_key].item13,
        item14: items_data[user_key].item14,
        item15: items_data[user_key].item15
    }
  }
 
}

function getAvatarData(data) {
  // Retrieving data if any
  var avatar_itemData = data.val();
  

  // Check if new user - has no real items reference key
  if (avatar_itemData == null)
  {
    refAvatar.push(avatar_items);
  }
  // Returning user - has items reference key
  else 
  {
    var keys = Object.keys(avatar_itemData);
    user_avatarItemsKey = keys[0];


    //retrieve data
    avatar_items = {
        hat: avatar_itemData[user_avatarItemsKey].hat,
        shirt: avatar_itemData[user_avatarItemsKey].shirt,
        shoes: avatar_itemData[user_avatarItemsKey].shoes,
    }
  }

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
    }
  }

  function drawAvatar(callback){
    loadImg("/images/avatar/Ferret.png");
    callback();  
  }
  // Virtually put on the avatar to make the ferret avatar
  
  function drawAvatarClothes(){
  loadImg(getItemURL(avatar_items["hat"]));
  loadImg(getItemURL(avatar_items["shirt"]));
  loadImg(getItemURL(avatar_items["shoes"]));
  }
  drawAvatar(drawAvatarClothes);
}

/*
  Adds item to user's item list! 
*/
function addItem(index) {
  // Only need reference to make this work - need to store key globally
  user_items["item"+index] = 1;
  var update = {};
  update[user_key] = user_items;
  refItems.update(update);
  console.log("Updated items");
}

function updateOnAvatarItems() {
  var update = {};
  update[user_avatarItemsKey] = avatar_items;
  refAvatar.update(update);
  console.log("Updated avatar");


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
  //randomPoints = new google.maps.MVCArray([]);
  
  refPoints.on('value', getPoints, errData);
  //return randomPoints;
}

function getPoints(data) {
  console.log("DATA: "+data.val());
  var points = data.val();
  var keys = Object.keys(points);
  var currentPoint = marker.getPosition();
  var c_lat = currentPoint.lat();
  var c_lng = currentPoint.lng();

console.log("Loading Points! :)");
  for (var i = 0 ; i < keys.length; i++) {

    var k = keys[i];
    //console.log(sender);
    //console.log(points[k].sender);

    //if(points[k].sender == sender) {
      //console.log("GOT HERE!");
      
      var lat = points[k].lat;
      var lng = points[k].lng;

      if ((Math.abs(c_lat - lat ) <= 0.001 || Math.abs(c_lng - lng) <= 0.001)) {
        prev_lat = c_lat;
        prev_lng = c_lng;
      }
      randomPoints.push(new google.maps.LatLng(lat,lng));
    //}
  }
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}

//////////////////// LOCATION POINTS Updater ////////////////////
function updatePoints(){
  currentPoint = marker.getPosition();

  
  if ((Math.abs(currentPoint.lat() - prev_lat ) > 0.0001 || Math.abs(currentPoint.lng() - prev_lng) > 0.0001)) { //} || (count < 3))  {
    console.log("GOT HERE TOO!")
    randomPoints.push(new google.maps.LatLng(currentPoint.lat(),currentPoint.lng()));
    prev_lat = currentPoint.lat();
    prev_lng = currentPoint.lng();

    // Add point to firebase
    point_data.lat = prev_lat;
    point_data.lng = prev_lng;

    if (refPoints != null) {
      refPoints.push(point_data);
      console.log("data pushed?");
    }
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
  heatmap.set('radius', heatmap.get('radius') ? null : 50);
}


// MAP STYLING
var terrainStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
];

function getItemURL(itemNum){
  var avatarBasePath = "/images/avatar/";
  var avatarPath = "";
  var avatarType;


  switch(itemNum){
      case 0:
        avatarPath = "/CowboyHat.png";
        avatarType = "hats";
        break;
      case 1:
        avatarPath = "/PropellerHat.png";
        avatarType = "hats";
        break;
      case 2:
        avatarPath = "/GraduationCap.png";
        avatarType = "hats";
        break;
      case 3:
        avatarPath = "/MagicalHat.png";
        avatarType = "hats";
        break;
      case 4:
        avatarPath = "/SunHat.png";
        avatarType = "hats";
        break;
      case 5:
        avatarPath = "/TopHat.png";
        avatarType = "hats";
        break;
      case 6:
        avatarPath = "/BabyBlueShirt.png";
        avatarType = "shirts";
        break;
      case 7:
        avatarPath = "/BlueShirtWhiteTrim.png";
        avatarType = "shirts";
        break;
      case 8:
        avatarPath = "/GreenStripeShirt.png";
        avatarType = "shirts";
        break;
      case 9:
        avatarPath = "/LeatherShirtWhiteTrim.png";
        avatarType = "shirts";
        break;
      case 10:
        avatarPath = "/PeachPolkaDotShirt.png";
        avatarType = "shirts";
        break;
      case 11:
        avatarPath = "/BlueSocks.png";
        avatarType = "shoes";
        break;
      case 12:
        avatarPath = "/BrownBoots.png";
        avatarType = "shoes";
        break;
      case 13:
        avatarPath = "/GreenSneakers.png";
        avatarType = "shoes";
        break;
      case 14:
        avatarPath = "/RedSneakers.png";
        avatarType = "shoes";
        break;
      case 15:
        avatarPath = "/RedSocks.png";
        avatarType = "shoes";
        break;  
      default:
        return "";
    }

    return avatarBasePath + avatarType + avatarPath; 

}