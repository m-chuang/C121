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



// Variables for Firebase retrieval and update
var sender;
var refItems;
var refAvatar;
var database;
var user_key; // used for items
var user_avatarItemsKey; // used for items on avatar


var user_items;
//var avatar_items;
var avatar_items = {
  hat: 99,
  shirt: 99,
  shoes: 99
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
	// Calling Firebase
	initFirebase();

	

	// One way to change an image
	//shoes.src = "/images/avatar/shoes/RedSneakers.png";

	// Another way to change an image with a function
	//setImg(hat, "/images/avatar/hats/PropellerHat.png");
});

// Load images by URL onto the canvas
function loadImg(imgUrl) {
	if(imgUrl == ""){ return;}
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
	drawAvatar(drawAvatarClothes);
}

function drawAvatar(callback){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	avatarBase = loadImg("/images/avatar/Ferret.png");
	// layer items
	callback();

}
function drawAvatarClothes(){
	loadImg(shoesUrl);
	loadImg(shirtUrl);
	loadImg(hatUrl);
}
function clearAvatar(){
	hatUrl = "";
	shirtUrl ="";
	shoesUrl ="";
	drawAvatar(drawAvatarClothes);
}

function save(){
	console.log("Yup");
	console.log(getItemNum(hatUrl));
	console.log(getItemNum(shirtUrl));
	console.log(getItemNum(shoesUrl));
	avatar_items = {
    hat: getItemNum(hatUrl),
    shirt: getItemNum(shirtUrl),
    shoes: getItemNum(shoesUrl)
   }

	updateOnAvatarItems();


	savedHatUrl = hatUrl;
	savedShirtUrl = shirtUrl;
	savedShoesUrl = shoesUrl;


	drawAvatar(drawAvatarClothes);


}

function restore(){
	hatUrl = savedHatUrl;
	shirtUrl = savedShirtUrl;
	shoesUrl = savedShoesUrl;
	drawAvatar(drawAvatarClothes);
}

function saveAvatar(){
  var canvas = document.getElementById("avatarCanvas");
  //document.write('<img src="'+canvas.toDataURL("image/png")+'"/>');
  window.location=canvas.toDataURL('png')

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
	for (avatar in user_items) {
		var avatarPath;

		var htmlpart1 = "<div class='col-xs-4 col-sm-2'> <a href='#' onclick= \" updateAvatar(this.children[0].src,'";
		var htmlpart2 = "'); return false; \" ><img src="
		var htmlpart3 = " width='100px' height='100px'></img></a></div>"
		var avatarType = "";


		switch(avatar){
			case "item0":
				avatarPath = " '/images/avatar/icons/CowboyHat.png'";
				avatarType = "hats";
				break;
			case "item1":
				avatarPath = "'/images/avatar/icons/PropellerHat.png'";
				avatarType = "hats";
				break;
			case "item2":
				avatarPath = "'/images/avatar/icons/GraduationCap.png'";
				avatarType = "hats";
				break;
			case "item3":
				avatarPath = "'/images/avatar/icons/MagicalHat.png'";
				avatarType = "hats";
				break;
			case "item4":
				avatarPath = "'/images/avatar/icons/SunHat.png'";
				avatarType = "hats";
				break;
			case "item5":
				avatarPath = "'/images/avatar/icons/TopHat.png'";
				avatarType = "hats";
				break;
			case "item6":
				avatarPath = "'/images/avatar/icons/BabyBlueShirt.png'";
				avatarType = "shirts";
				break;
			case "item7":
				avatarPath = "'/images/avatar/icons/BlueShirtWhiteTrim.png'";
				avatarType = "shirts";
				break;
			case "item8":
				avatarPath = "'/images/avatar/icons/GreenStripeShirt.png'";
				avatarType = "shirts";
				break;
			case "item9":
				avatarPath = "'/images/avatar/icons/LeatherShirtWhiteTrim.png'";
				avatarType = "shirts";
				break;
			case "item10":
				avatarPath = "'/images/avatar/icons/PeachPolkaDotShirt.png'";
				avatarType = "shirts";
				break;
			case "item11":
				avatarPath = "'/images/avatar/icons/BlueSocks.png'";
				avatarType = "shoes";
				break;
			case "item12":
				avatarPath = "'/images/avatar/icons/BrownBoots.png'";
				avatarType = "shoes";
				break;
			case "item13":
				avatarPath = "'/images/avatar/icons/GreenSneakers.png'";
				avatarType = "shoes";
				break;
			case "item14":
				avatarPath = "'/images/avatar/icons/RedSneakers.png'";
				avatarType = "shoes";
				break;
			case "item15":
				avatarPath = "'/images/avatar/icons/RedSocks.png'";
				avatarType = "shoes";
				break;	
		}
		
		if( user_items[avatar] == 1){
			var path = htmlpart1 + avatarType + htmlpart2 + avatarPath + htmlpart3;

			// Add to All Items
			document.getElementById("all_items").innerHTML += path;

			switch(avatarType){
				case "hats":
					document.getElementById("hat_items").innerHTML += path;
					break;
				case "shirts":
					document.getElementById("shirt_items").innerHTML += path;

					break
				case "shoes":
					document.getElementById("shoes_items").innerHTML += path;
					break;
			}
		} 
		else{

		}
	}
}




/* FIREBASE */
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
  //refPoints = database.ref('points');
   // FIREBASE
  const lg_signout = document.getElementById('lg_signout');

  lg_signout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

   firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
          console.log(firebaseUser);

          sender = firebaseUser.uid;
           /* LOADING USER'S ITEMS */
          // Creating reference to user's items
          refItems = database.ref(sender+"/items");
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
  loadAvatars();

 
  // load base ferret avatar
  avatarBase = loadImg("/images/avatar/Ferret.png");
  // layer items
  // Update Items according to database
  shoesUrl = getItemURL(avatar_items["shoes"]);
  shirtUrl = getItemURL(avatar_items["shirt"]);
  hatUrl = getItemURL(avatar_items["hat"]);


  savedHatUrl = getItemURL(avatar_items["hat"]);
  savedShirtUrl = shirtUrl;
  savedShoesUrl = shoesUrl;

	loadImg(shoesUrl);	
	loadImg(shirtUrl);
	loadImg(hatUrl);
	//save();

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
  shoesUrl = getItemURL(avatar_items["shoes"]);
  shirtUrl = getItemURL(avatar_items["shirt"]);
  hatUrl = getItemURL(avatar_items["hat"]);

  savedHatUrl = getItemURL(avatar_items["hat"]);
  savedShirtUrl = getItemURL(avatar_items["shirt"]);
  savedShoesUrl = getItemURL(avatar_items["shoes"]);

	loadImg(shoesUrl);
	loadImg(shirtUrl);
	loadImg(hatUrl);
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}

/* Update what items avatar is wearing in firebase */
function updateOnAvatarItems() {
  var update = {};
  update[user_avatarItemsKey] = avatar_items;
  refAvatar.update(update);
  console.log("Updated avatar");


}

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

function getItemNum(itemURL){
	var itemNum;


	switch (itemURL) {
		case "/images/avatar/hats/CowboyHat.png":
			itemNum = 0;
			break;
		case "/images/avatar/hats/PropellerHat.png":
			itemNum = 1;
			break;
		case "/images/avatar/hats/GraduationCap.png":
			itemNum = 2;
			break;
		case "/images/avatar/hats/MagicalHat.png":
			itemNum = 3;
			break;
		case "/images/avatar/hats/SunHat.png":
			itemNum = 4;
			break;
		case "/images/avatar/hats/TopHat.png":
			itemNum = 5;
			break;
		case "/images/avatar/shirts/BabyBlueShirt.png":
			itemNum = 6;
			break;
		case "/images/avatar/shirts/BlueShirtWhiteTrim.png":
			itemNum = 7;
			break;
		case "/images/avatar/shirts/GreenStripeShirt.png":
			itemNum = 8;
			break;
		case "/images/avatar/shirts/LeatherShirtWhiteTrim.png":
			itemNum = 9;
			break;
		case "/images/avatar/shirts/PeachPolkaDotShirt.png":
			itemNum = 10;
			break;
		case "/images/avatar/shoes/BlueSocks.png":
			itemNum = 11;
			break;
		case "/images/avatar/shoes/BrownBoots.png":
			itemNum = 12;
			break;
		case "/images/avatar/shoes/GreenSneakers.png":
			itemNum = 13;
			break;
		case "/images/avatar/shoes/RedSneakers.png":
			itemNum = 14;
			break;
		case "/images/avatar/shoes/RedSocks.png":
			itemNum = 15;
			break;
		default:	
			itemNum = 99;
			break;
	}

	return itemNum;

}
 