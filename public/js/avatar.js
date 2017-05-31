// array of tab colors
//var tabColorArr = ["#ff9999", "#ffcc66", "#99ff66"]
// Canvas variables
var canvas = document.getElementById("avatarCanvas");
var ctx = canvas.getContext("2d");
// Each type of item to display on the avatar
var avatarBase; // base ferret avatar
var hatUrl = "/images/avatar/hats/PropellerHat.png";
var shirtUrl = "/images/avatar/shirts/GreenStripeShirt.png";
var shoesUrl = "/images/avatar/shoes/BlueSocks.png";

var savedHatUrl;
var savedShirtUrl;
var savedShoesUrl;

//until the actual data is inputted
var dummy_item_data = {
  item0: 1,
  item1: 0,
  item2: 0,
  item3: 1,
  item4: 0,
  item5: 0,
  item6: 0,
  item7: 1,
  item8: 0,
  item9: 0,
  item10: 0,
  item11: 0,
  item12: 1,
  item13: 1,
  item14: 0,
  item15: 0,
}
// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	//loadTabColors();
	loadAvatars();

	// load base ferret avatar
	avatarBase = loadImg("/images/avatar/Ferret.png");
  // layer items
	loadImg(shoesUrl);
	loadImg(shirtUrl);
	loadImg(hatUrl);
	save();

	// One way to change an image
	//shoes.src = "/images/avatar/shoes/RedSneakers.png";

	// Another way to change an image with a function
	//setImg(hat, "/images/avatar/hats/PropellerHat.png");
});

// Load images by URL onto the canvas
function loadImg(imgUrl) {
	var imgObj = new Image();
	var newString = String(imgUrl);
	imgObj.src = newString;

	imgObj.onload = function() {
		ctx.drawImage(imgObj, 0, 0);
	}

	return imgObj.src;
}

// Change the image
function setImg(imgObj,imgUrl) {
  imgObj.src = imgUrl;
}

function updateAvatar(image,type){
	var indexOfPath;
	console.log(image);
	
	// Do some String manipulation to find out which item was clicked
	for( var i = image.length-1 ; i > 0; i--){
		if(image[i] == "/"){
			indexOfPath = i;
			console.log(i);
			break;
		}
	}
	var avatarPath = image.slice(indexOfPath,image.length);
	console.log(avatarPath);
	var newUrl = "/images/avatar/"+ type + avatarPath;
	
	switch(type){
		case "hats":
			hatUrl = newUrl;
			break;
		case "shirts":
			shirtUrl = newUrl;
			break;
		case "shoes":
			shoesUrl = newUrl;
			break;
		default:
			console.log("Case statement messed up in updateAvatar");
	}		
	// Redraw the canvas with the updated items
	drawAvatar();
}

function drawAvatar(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	avatarBase = loadImg("/images/avatar/Ferret.png");
	// layer items
	loadImg(shoesUrl);
	loadImg(shirtUrl);
	loadImg(hatUrl);
	

}

function save(){
	savedHatUrl = hatUrl;
	savedShirtUrl = shirtUrl;
	savedShoesUrl = shoesUrl;
	drawAvatar();
}

function restore(){
	hatUrl = savedHatUrl;
	shirtUrl = savedShirtUrl;
	shoesUrl = savedShoesUrl;
	drawAvatar();
}

function saveAvatar(){
  var canvas = document.getElementById("avatarCanvas");
  document.write('<img src="'+canvas.toDataURL("image/png")+'"/>')

  /*var Vcanvas = document.createElement("CANVAS");
  Vcanvas.height = "284";
  Vcanvas.width = "486";
  var Vctx = Vcanvas.getContext("2d");

  
  var imgObj = new Image();
	var newString = String("/images/avatar/Ferret.png");
	imgObj.src = newString;

	imgObj.onload = function() {
		Vctx.drawImage(imgObj, 0, 0);
		var data = Vcanvas.toDataURL();
	  	console.log(Vcanvas.toDataURL("image/png"));
  		document.write('<img src="'+Vcanvas.toDataURL("image/png")+'"/>')
	}
	*/


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

function loadAvatars(){
	console.log(document.getElementById("all_items"));
	for (avatar in dummy_item_data) {
		var avatarPath;

		var htmlpart1 = "<div class='col-xs-4 col-sm-2'> <a href='#' onclick= \" updateAvatar(this.children[0].src,'hats'); return false; \" ><img src=";
		var htmlpart2 = " width='100px' height='100px'></img></a></div>"


		switch(avatar){
			case "item0":
				avatarPath = " '/images/avatar/icons/CowboyHat.png'";
				break;
			case "item1":
				avatarPath = "'/images/avatar/icons/PropellerHat.png'"
				break;
			case "item2":
				avatarPath = "'/images/avatar/icons/GraduationCap.png'";
				break;
			case "item3":
				avatarPath = "'/images/avatar/icons/MagicalHat.png'";
				break;
			case "item4":
				avatarPath = "'/images/avatar/icons/SunHat.png'";
				break;
			case "item5":
				avatarPath = "'/images/avatar/icons/TopHat.png'";
				break;
			case "item6":
				avatarPath = "'/images/avatar/icons/BabyBlueShirt.png'";
				break;
			case "item7":
				avatarPath = "'/images/avatar/icons/BlueShirtWhiteTrim.png'";
				break;
			case "item8":
				avatarPath = "'/images/avatar/icons/GreenStripeShirt.png'";
				break;
			case "item9":
				avatarPath = "'/images/avatar/icons/LeatherShirtWhiteTrim.png'";
				break;
			case "item10":
				avatarPath = "'/images/avatar/icons/PeachPolkaDotShirt.png'";
				break;
			case "item11":
				avatarPath = "'/images/avatar/icons/BlueSocks.png'";
				break;
			case "item12":
				avatarPath = "'/images/avatar/icons/BrownBoots.png'";
				break;
			case "item13":
				avatarPath = "'/images/avatar/icons/GreenSneakers.png'";
				break;
			case "item14":
				avatarPath = "'/images/avatar/icons/RedSneakers.png'";
				break;
			case "item15":
				avatarPath = "'/images/avatar/icons/RedSocks.png'";
				break;	
		}
		
		if( dummy_item_data[avatar] == 1){
			var path = htmlpart1 + avatarPath + htmlpart2;

			document.getElementById("all_items").innerHTML += path;
		} 
		else{

		}
	}
}