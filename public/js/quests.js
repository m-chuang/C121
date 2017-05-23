var refItems;
var items = {
  sender: null,
  hCowboy: null,
  hPropeller: null,
  hGraduation: null,
  hMagical: null,
  hSun: null,
  hTop: null,
  sBabyBlue: null,
  sBlue: null,
  sGreenStripe: null,
  sLeather: null,
  sPeachPolka: null,
  ssBlue: null,
  ssBrown: null,
  ssGreen: null,
  ssRedSneakers: null,
  ssRedSocks: null
};


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
  refItems = database.ref('items');

  // FIREBASE
  const lg_signout = document.getElementById('lg_signout');

  lg_signout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

   firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
          console.log(firebaseUser);

          sender = data.sender = firebaseUser.uid;

        } else {
          console.log('not logged in');
          window.location = './';
        }
    });
}


function getItems(){
  refItems.on("items", function(snapshot){
    console.log(snapshot.val());
  }, function(errorObject){
    console.log("The read failed: " + errorObject.code);
  }); 
}

getItems();
setItems(1);

//////////////////// LOCATION POINTS Updater ////////////////////
function setItems(val){
  if(val == 1){ hCowboy = true; }
  if(val == 2){ hPropeller = true; }  
  if(val == 3){ hGraduation = true; }
  if(val == 4){ hMagical = true; }
  if(val == 5){ hSun = true; }
  if(val == 6){ hTop = true; }
  if(val == 7){ sBabyBlue = true; }
  if(val == 8){ sBlue = true; }
  if(val == 9){ sGreenStripe = true; }
  if(val == 10){ sLeather = true; }
  if(val == 11){ sPeachPolka = true; }
  if(val == 12){ ssBlue = true; }
  if(val == 13){ ssBrown = true; }
  if(val == 14){ ssGreen = true; }
  if(val == 15){ ssRedSneakers = true; }
  if(val == 16){ ssRedSocks = true; }
}
