//////////////////////////////////
// !!!WARNING!!! - JH
// -------------------------------
// If you are editing this in the app.js file don't! 
// Becuase as soon as the gulp process runs you work will be over written!!!
// Please edit the indavidual files in /www/js/app/..
//////////////////////////////////


//////////////////////////////////
//base start
//////////////////////////////////


//////////////////////////////////
// Information - JH
// -------------------------------
// I add app = to the angular.modules( 'bla', [ 'bla', 'bla', 'bla'])
// Becuase if anything that doesnt start with .whatever will break the app
// But! By assigning it to a var it always knows what its base module is!
//////////////////////////////////
app = angular.module( 'starter', [ 'ionic', 'starter.controllers', 'starter.services' ] )

// everything in run is triggered when the app runs (who knew!)
app.run( function ( $ionicPlatform )
{
	$ionicPlatform.ready( function ( )
	{
		// Initialize Firebase
		var config = {
			apiKey: "AIzaSyDXuQU3J2jRIYFf2ZrUfAU3yId5O9EfMzQ",
			authDomain: "mobile-app-uni.firebaseapp.com",
			databaseURL: "https://mobile-app-uni.firebaseio.com",
			storageBucket: "mobile-app-uni.appspot.com",
			messagingSenderId: "968206557542"
		};
		firebase.initializeApp( config );

		// Hide the accessory bar by default
		// (remove this to show the accessory bar above the keyboard for form inputs)
		if ( window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard )
		{
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar( true );
			cordova.plugins.Keyboard.disableScroll( true );

		}
		if ( window.StatusBar )
		{
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault( );
		}
	} );
} )

//////////////////////////////////
//base end
//////////////////////////////////

