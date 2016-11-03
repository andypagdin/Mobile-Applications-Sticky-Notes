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


//////////////////////////////////
//router start
//////////////////////////////////

app.config( function ( $stateProvider, $urlRouterProvider )
{

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider
		.state( 'login',
		{
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl'
		} )

	.state( 'name',
	{
		url: '/name',
		templateUrl: 'templates/login-name.html',
		controller: 'LoginCtrl'
	} )

	.state( 'forms',
	{
		url: '/forms',
		templateUrl: 'templates/forms.html',
		controller: 'FromCtrl'
	} )

	.state( 'flip',
	{
		url: '/flip',
		templateUrl: 'templates/flip.html',
		controller: 'FlipCtrl'
	} )

	// setup an abstract state for the tabs directive
	.state( 'tab',
	{
		url: '/tab',
		abstract: true,
		templateUrl: 'templates/tabs.html'
	} )

	// Each tab has its own nav history stack:

	.state( 'tab.dash',
	{
		url: '/dash',
		views:
		{
			'tab-dash':
			{
				templateUrl: 'templates/tab-dash.html',
				controller: 'DashCtrl'
			}
		}
	} )

	.state( 'tab.chats',
		{
			url: '/chats',
			views:
			{
				'tab-chats':
				{
					templateUrl: 'templates/tab-chats.html',
					controller: 'ChatsCtrl'
				}
			}
		} )
		.state( 'tab.chat-detail',
		{
			url: '/chats/:chatId',
			views:
			{
				'tab-chats':
				{
					templateUrl: 'templates/chat-detail.html',
					controller: 'ChatDetailCtrl'
				}
			}
		} )

	.state( 'tab.account',
	{
		url: '/account',
		views:
		{
			'tab-account':
			{
				templateUrl: 'templates/tab-account.html',
				controller: 'AccountCtrl'
			}
		}
	} );

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise( '/login' );

} );

//////////////////////////////////
//router end
//////////////////////////////////


//////////////////////////////////
//global functions start
//////////////////////////////////

syntaxHighlight = function ( json )
{
	// This is a fancy way of doing a stringify
	// It attaches <spans> with classes so you can add colors for each data type
	// heads up it takes a second, regex is HEAVY!
	if ( typeof json != 'string' )
	{
		json = JSON.stringify( json, null, 4 );
	}
	json = json.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
	return json.replace( /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function ( match )
	{
		var cls = 'number';
		if ( /^"/.test( match ) )
		{
			if ( /:$/.test( match ) )
			{
				cls = 'key';
			}
			else
			{
				cls = 'string';
			}
		}
		else if ( /true|false/.test( match ) )
		{
			cls = 'boolean';
		}
		else if ( Number.isInteger( match ) )
		{
			console.log( "WE FOUND AN INT!" )
			cls = 'int';
		}
		else if ( /null/.test( match ) )
		{
			cls = 'null';
		}
		return '<span class="' + cls + '">' + match + '</span>';
	} );
}

pretty = function ( json, heavy )
{
	if ( heavy )
	{
		return syntaxHighlight( json )
	}
	return JSON.stringify( json, null, 4 );
};

//////////////////////////////////
//global functions end
//////////////////////////////////

