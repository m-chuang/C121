// array of tab colors
//var tabColorArr = ["#ff9999", "#ffcc66", "#99ff66"]
var canvas = document.getElementById("avatarCanvas");
var ctx = canvas.getContext("2d");

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	//loadTabColors();

	// base ferret avatar
	var avatarBase = new Image();
	avatarBase.onload = function() {
			ctx.drawImage(avatarBase, 50, 91);
	}
	avatarBase.src = "/images/avatar/Ferret.png";
	//var avatarBase = loadImg("/images/avatar/Ferret.png");

	var shoes = loadImg("/images/avatar/shoes/BlueSocks.png");
	var shirts = loadImg("/images/avatar/shirts/GreenStripeShirt.png");
	var hat = loadImg("/images/avatar/hats/TopHat.png");

	// One way to change an image
	shoes.src = "/images/avatar/shoes/RedSneakers.png";

	// Another way to change an image with a function
	setImg(hat, "/images/avatar/hats/PropellerHat.png");
});

// Load images by URL onto the canvas
function loadImg(imgUrl) {
	var imgObj = new Image();
	imgObj.onload = function() {
		ctx.drawImage(imgObj, 0, 0);
	}
	imgObj.src = imgUrl;
	return imgObj;
}

// Change the image
function setImg(imgObj,imgUrl) {
  imgObj.src = imgUrl;
}


// load each inventory tab's background color
/*function loadTabColors() {
	var tabs = document.getElementsByClassName("tab");
	for(i = 0; i < tabs.length; i++ ) {
		var tab = document.getElementById("tab"+i);
		tab.style.backgroundColor = tabColorArr[i];
	}
	// default inventory bg color is the first tab's color
	var inventorybg = document.getElementById("inventoryContent");
	inventorybg.style.backgroundColor = tabColorArr[0];
}

// change the bgcolor of the inventory based on tab clicked
function selectTab(tabNum) {
	var inventorybg = document.getElementById("inventoryContent");
	inventorybg.style.backgroundColor = tabColorArr[tabNum];
	inventorybg.innerHTML = tabNum;
}*/