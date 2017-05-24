/* Initializing firebase */
(function() {
  var config = {
    apiKey: "AIzaSyD3R60ccA0wuNN40tV_aLPGQZl4yrUjcTQ",
    authDomain: "ferret-82825.firebaseapp.com",
    databaseURL: "https://ferret-82825.firebaseio.com",
    projectId: "ferret-82825",
    storageBucket: "ferret-82825.appspot.com",
    messagingSenderId: "285929520709"
  };
  firebase.initializeApp(config);

      // Get elements
      const	lg_email = document.getElementById("lg_email");
      const	lg_password = document.getElementById('lg_password');
      const lg_password_confirm = document.getElementById('lg_password_confirm');
      const	lg_button = document.getElementById('lg_button');
      const	lg_signup = document.getElementById('lg_signup');
      const lg_button_signup = document.getElementById('lg_button_signup');


      // TEMP!!!!!!!!!
      const temp_signout = document.getElementById('temp_signout');

      if (lg_button) {
        //Add login event ---
        lg_button.addEventListener('click', e=> {
        	// Get email and password
        	const email = lg_email.value;
        	const password = lg_password.value;
        	const auth = firebase.auth();

        	// Sign in
        	const promise = auth.signInWithEmailAndPassword(email,password);
        	promise.catch(e => document.getElementById("message").innerHTML = (e.message)); 

        });
    }

   

      if (lg_button_signup && lg_password_confirm) {
          
        // Add Sign Up
        lg_button_signup.addEventListener('click', e => {

        	// Get email and password
        	// TODO: CHECK 4 REAL EMAIL
        	const email = lg_email.value;
        	const password = lg_password.value;
          const passwordC = lg_password_confirm.value;
        	const auth = firebase.auth();

           if (lg_password_confirm.value == lg_password.value) {
          	// Sign in
          	const promise = auth.createUserWithEmailAndPassword(email,password);
          	promise.catch(e => console.log(e.message)); 
          } else {
             document.getElementById('message').innerHTML = "Your passwords do not match";
          }

        });
      }

      //Add a realtime Listener
      firebase.auth().onAuthStateChanged(firebaseUser => {
      	if(firebaseUser) {
      		console.log(firebaseUser);
          window.location = 'home';
      	} else {
      		console.log('not logged in');
      	}

      });
}());
