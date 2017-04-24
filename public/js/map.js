// Shared variables
var map;
var heatmap;


function initMap() {
  // default centered location (Student Health and Wellness Center)
  var defaultCenter = {lat: 32.879425, lng: -117.238037};

  // Initialize the map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18, // default zoom level
    center: defaultCenter
  });

  // patterened tile overlay
  map.overlayMapTypes.insertAt(
      0, new CoordMapType(new google.maps.Size(256, 256)));

  // Initialize the heatmap
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map
  });

  // current location marker (red)
  var marker = new google.maps.Marker({
    position: defaultCenter,
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

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);

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
}


// Error message for if can't gather current location
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
     infoWindow.open(map);
}


// autoUpdate to track user location data
function autoUpdate() {
  setTimeout(autoUpdate, 1000); // how often to track and update location data
}


// Get map data points (used for the Heatmap)
function getPoints() {
  return [
    new google.maps.LatLng(32.8796116,-117.2358329),
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
  div.style.fontSize = '10';
  div.style.borderStyle = 'solid';

  // border properties
  div.style.borderWidth = '1px';
  div.style.borderColor = '#AAAAAA';

  // image url
  div.style.backgroundImage = "url('/images/grass_wallpaper.png')";
  div.style.opacity = ".6"; // change opacity
  return div;
};