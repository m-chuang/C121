// Shared variables
var map;
var defaultCenter;
var marker;
var icon = "/images/test_ferret.png";
var heatmap;
var GeoMarker;
var errorCircle;
var center;
var zoomLevel;

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
        controlText.innerHTML = 'Return to Current Location';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          map.setCenter(center);
        });

}


//require('./geolocation-marker.js')

function initMap() {
  // Default centered location (Student Health and Wellness Center)
  defaultCenter = {lat: 32.879425, lng: -117.238037};

  // Initialize the map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18, // default zoom level
    center: defaultCenter,
    maxZoom: 18,
    minZoom: 17,
  });

  /*
  // Location + radius *currently broken
  GeoMarker = new GeolocationMarker();
  GeoMarker.setCircleOptions({fillColor: '#808080'});
  */

  // Patterened tile overlay
  map.overlayMapTypes.insertAt(
    0, new CoordMapType(new google.maps.Size(256, 256)));

  // Initialize the heatmap
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map
  });

  // Default location marker (red)
  marker = new google.maps.Marker({
    position: defaultCenter,
    icon: '/images/test_ferret.png',
    map: map
  });

  infoWindow = new google.maps.InfoWindow;

  // Get current location
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Print to console the coordinates of the current location
      console.log("lat=" + pos.lat + ", lng=" + pos.lng);

      //infoWindow.setPosition(pos);
      //infoWindow.setContent('Location found.');
      //infoWindow.open(map);
      map.setCenter(pos);
      center = pos;


      /*map.overlayMapTypes.insertAt(
      0, new CoordMapType(new google.maps.Size(256, 256)));*/
/*      var imageBounds = {
    		north: pos.lat + .0003,
    		south: pos.lat - .0003,
    		east:  pos.lng + .0003,
    		west:  pos.lng - .0003
  	};

  historicalOverlay = new google.maps.GroundOverlay(
      'https://people.ucsc.edu/~kiqnguye/grass_wallpaper.png',
      imageBounds);
  historicalOverlay.setMap(map);
*/
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
        icon: '/images/test_ferret.png',
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


// Get map data points (used for the Heatmap)
function getPoints() {
  return [
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
}


// Function to calculate how many tiles needed to overlay, then goes and does it.
// topLeftX = the top left X coordinate
// topLeftY = the top right Y coordinate
// topRightX = the bottom right X coordinate
// topRightY = the bottom right Y coordinate
function tileOverlay(topLeftX,topLeftY,bottomRightX,bottomRightY){
}
// Tile overlay pattern
function CoordMapType(tileSize) {
  this.tileSize = tileSize;
}
CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement('div');
  div.innerHTML = coord;
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  
  

  /*div.style.width = '150' + 'mm';
  div.style.height = '150' + 'mm';
  */

  /* 0 font-size so coordinates disappear*/
  div.style.fontSize = '0';
  div.style.borderStyle = 'solid';

  // border properties
  div.style.borderWidth = '0px';
  div.style.borderColor = '#AAAAAA';

  if( Math.floor((Math.random() * 10) + 1) % 2 == 0 ){
    return div;
  }
   
  // image url
  div.style.backgroundImage = "url('/images/grass_wallpaper.png')";
  div.style.backgroundSize = "100%";
  div.style.opacity = ".52"; // change opacity
  
  return div;
};