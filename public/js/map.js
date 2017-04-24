// Function to calculate how many tiles needed to overlay, then goes and does it.
// topLeftX = the top left X coordinate
// topLeftY = the top right Y coordinate
// topRightX = the bottom right X coordinate
// topRightY = the bottom right Y coordinate
function tileOverlay(topLeftX,topLeftY,bottomRightX,bottomRightY){
}

function CoordMapType(tileSize) {
  this.tileSize = tileSize;
}

/* overlay pattern */
CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement('div');
  div.innerHTML = coord;
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.fontSize = '10';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';
  div.style.borderColor = '#AAAAAA';
  div.style.backgroundImage = "url('/images/grass_wallpaper.png')";
  div.style.opacity = ".6";
  return div;
};


function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });

  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);

      map.overlayMapTypes.insertAt(
      0, new CoordMapType(new google.maps.Size(256, 256)));
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
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
     infoWindow.open(map);
}

function autoUpdate() {


  setTimeout(autoUpdate, 1000)
}