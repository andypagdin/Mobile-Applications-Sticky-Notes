//////////////////////////////////
// !!!WARNING!!! - JH
// -------------------------------
// If you are editing this in the controllers.js file don't! 
// Becuase as soon as the gulp process runs you work will be over written!!!
// Please edit the indavidual files in /www/js/controllers/..
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
app = angular.module( 'starter.controllers', [ ] )
	//inject indavidual controllers here!

//////////////////////////////////
//base end
//////////////////////////////////


//////////////////////////////////
//AccountCtrl start
//////////////////////////////////

app.controller( 'AccountCtrl', function ( $scope, $state )
{

	firebase.auth( ).onAuthStateChanged( function ( user )
	{
		if ( user )
		{
			$scope.email = user.email
			$scope.uid = user.uid
			$scope.displayName = user.displayName

			var isVerified = user.emailVerified

			if ( user.emailVerified )
			{
				$scope.isVerified = "You have verified your account";
			}
			else
			{
				$scope.isVerified = "You have not verified your account";
			}
		}
		else
		{

		}
	} );

	$scope.signOut = function ( )
	{
		firebase.auth( ).signOut( ).then( function ( )
		{
			$state.go( 'login' )
			console.log( "signed out" )
		}, function ( error )
		{
			console.log( error )
		} );
	}

	$scope.settings = {
		enableFriends: true
	};
} );

//////////////////////////////////
//AccountCtrl end
//////////////////////////////////


//////////////////////////////////
//ChatsCtrl start
//////////////////////////////////

app.controller( 'ChatsCtrl', function ( $scope, Chats )
{
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	$scope.chats = Chats.all( );
	$scope.remove = function ( chat )
	{
		Chats.remove( chat );
	};
} )

//////////////////////////////////
//ChatsCtrl end
//////////////////////////////////


//////////////////////////////////
//ChatDetailCtrl start
//////////////////////////////////

app.controller( 'ChatDetailCtrl', function ( $scope, $stateParams, Chats )
{
	$scope.chat = Chats.get( $stateParams.chatId );
} )

//////////////////////////////////
//ChatDetailCtrl end
//////////////////////////////////


//////////////////////////////////
//DashCtrl start
//////////////////////////////////

app.controller( 'DashCtrl', function ( $scope )
{
	firebase.auth( ).onAuthStateChanged( function ( user )
	{
		if ( user )
		{
			$scope.displayName = user.displayName
		}
		else
		{

		}
	} );
} );

//////////////////////////////////
//DashCtrl end
//////////////////////////////////


//////////////////////////////////
//FlipCtrl start
//////////////////////////////////

app.controller( 'FlipCtrl', function ( $scope )
{
	$scope.cards = [
	{
		"title": "Card 1",
		"flipped": false
	},
	{
		"title": "Card 2",
		"flipped": false
	},
	{
		"title": "Card 3",
		"flipped": false
	},
	{
		"title": "Card 4",
		"flipped": false
	} ]
	$scope.flipped = false
	$scope.flip = function ( key )
	{
		$scope.cards[ key ].flipped = !$scope.cards[ key ].flipped
		console.log( "flipp?", $scope.flipped )
	}


} );

//////////////////////////////////
//FlipCtrl end
//////////////////////////////////


//////////////////////////////////
//LoginCtrl start
//////////////////////////////////

app.controller( 'LoginCtrl', function ( $scope, $state )
{
	//////////////////////////////////
	// !!!IMPORTANT!!! - JH
	// -------------------------------
	// stupid angular scoping issues means that the ion-content 
	// container makes a clone of the $scope meaning you need to decalre vars ahead of
	// using them in the view otherwise the js wont know what you are refferencing
	//////////////////////////////////
	$scope.auth = {
		email: "",
		password: ""
	}
	$scope.error_output = {
		user: "",
		admin: ""
	}
	$scope.user_data = {
		displayName: "",
		email: "",
		emailVerified: "",
		photoURL: "",
		isAnonymous: "",
		uid: "",
		providerData: ""
	}
	$scope.input = {
		displayName: ""
	}


	/**
	 * Handles the sign in button press.
	 */
	$scope.toggleSignIn = function ( )
	{
		if ( firebase.auth( ).currentUser )
		{
			// [START signout]
			firebase.auth( ).signOut( );
			// [END signout]
		}
		else
		{
			var email = $scope.auth.email;
			var password = $scope.auth.password;
			if ( !email || email.length < 4 )
			{
				$scope.error_output.user = 'Please enter an email address.';
				return;
			}
			if ( !password || password.length < 4 )
			{
				$scope.error_output.user = 'Please enter a password.';
				return;
			}
			// Sign in with email and pass.
			// [START authwithemail]
			firebase.auth( ).signInWithEmailAndPassword( email, password ).catch( function ( error )
			{
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// [START_EXCLUDE]
				if ( errorCode === 'auth/wrong-password' )
				{
					$scope.error_output.user = "Wrong password."
				}
				else
				{
					$scope.error_output.admin = "Wrong password."
					console.error( errorMessage );
				}
				console.log( error );

				$scope.signinable = false
					// document.getElementById( 'quickstart-sign-in' ).disabled = false;
					// [END_EXCLUDE]
			} );
			// [END authwithemail]
		}
		$scope.signinable = true
			// document.getElementById( 'quickstart-sign-in' ).disabled = true;
	}

	/**
	 * Handles the sign up button press.
	 */
	$scope.handleSignUp = function ( )
	{
		var email = $scope.auth.email;
		var password = $scope.auth.password;
		if ( email.length < 4 )
		{
			console.info( 'Please enter an email address.' );
			return;
		}
		if ( password.length < 4 )
		{
			console.info( 'Please enter a password.' );
			return;
		}
		// Sign in with email and pass.
		// [START createwithemail]
		firebase.auth( ).createUserWithEmailAndPassword( email, password ).catch( function ( error )
		{
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// [START_EXCLUDE]
			if ( errorCode == 'auth/weak-password' )
			{
				console.error( 'The password is too weak.' );
			}
			else
			{
				console.error( errorMessage );
			}
			console.log( error );
			// [END_EXCLUDE]
		} );
		// [END createwithemail]
	}

	/**
	 * Sends an email verification to the user.
	 */
	$scope.sendEmailVerification = function ( )
	{
		// [START sendemailverification]
		firebase.auth( ).currentUser.sendEmailVerification( ).then( function ( )
		{
			// Email Verification sent!
			// [START_EXCLUDE]
			console.info( 'Email Verification Sent!' );
			// [END_EXCLUDE]
		} );
		// [END sendemailverification]
	}

	$scope.sendPasswordReset = function ( )
		{
			var email = $scope.auth.email;
			// var email = document.getElementById( 'email' ).value;
			// [START sendpasswordemail]
			firebase.auth( ).sendPasswordResetEmail( email ).then( function ( )
			{
				// Password Reset Email Sent!
				// [START_EXCLUDE]
				console.info( 'Password Reset Email Sent!' );
				// [END_EXCLUDE]
			} ).catch( function ( error )
			{
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// [START_EXCLUDE]
				if ( errorCode == 'auth/invalid-email' )
				{
					console.error( errorMessage );
				}
				else if ( errorCode == 'auth/user-not-found' )
				{
					console.error( errorMessage );
				}
				console.log( error );
				// [END_EXCLUDE]
			} );
			// [END sendpasswordemail];
		}
		// firebase.auth( ).onAuthStateChanged( function ( user )
		// 	{
		// 		console.log( "AUTH CHANGE", user )
		// 	} )


	/**
	 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
	 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
	 *    out, and that is where we update the UI.
	 */
	$scope.initApp = function ( )
	{
		// Listening for auth state changes.[START authstatelistener]
		firebase.auth( ).onAuthStateChanged( function ( user )
		{
			console.log( "AUTH CHANGE", user )
				// [START_EXCLUDE silent]
				// document.getElementById('quickstart-verify-email').disabled = true;
			$scope.verifyable = true
				// [END_EXCLUDE]
			if ( user )
			{
				// User is signed in.
				$scope.signed_in = true;
				var displayName = user.displayName;
				var email = user.email;
				var emailVerified = user.emailVerified;
				var photoURL = user.photoURL;
				var isAnonymous = user.isAnonymous;
				var uid = user.uid;
				var providerData = user.providerData;
				$scope.user_data.displayName = displayName
				$scope.user_data.email = email
				$scope.user_data.emailVerified = emailVerified
				$scope.user_data.photoURL = photoURL
				$scope.user_data.isAnonymous = isAnonymous
				$scope.user_data.uid = uid
				$scope.user_data.providerData = providerData
					// [START_EXCLUDE silent]
				$scope.login_status = 'Signed in'
				$scope.sign_status_text = 'Sign out'
				$scope.quick_start_acc_details = pretty( user )

				// If the user does not have a display name set (first time visiting)
				// Point them to set one, else go home 
				if ( displayName )
				{
					$state.go( 'tab.dash' );
					console.log( "display name set " + displayName )
				}
				else
				{
					$state.go( 'name' );
					console.log( "display name not set" )
				}

				console.log( "view should have changed with this data - ", $scope.user_data )

				// document.getElementById( 'quickstart-sign-in-status' ).textContent = 'Signed in';
				// document.getElementById( 'quickstart-sign-in' ).textContent = 'Sign out';
				// document.getElementById( 'quickstart-account-details' ).textContent = JSON.stringify( user, null, '  ' );
				if ( !emailVerified )
				{

					$scope.verifyable = false
						// document.getElementById( 'quickstart-verify-email' ).disabled = false;
				}
				// [END_EXCLUDE]
			}
			else
			{
				// User is signed out.
				// [START_EXCLUDE silent]
				$scope.user_data.displayName = ""
				$scope.user_data.email = ""
				$scope.user_data.emailVerified = ""
				$scope.user_data.photoURL = ""
				$scope.user_data.isAnonymous = ""
				$scope.user_data.uid = ""
				$scope.user_data.providerData = ""
				$scope.signed_in = false;
				$scope.login_status = 'Signed out'
				$scope.sign_status_text = 'Sign in'
				$scope.quick_start_acc_details = 'null'
				console.log( "view should have changed with this data - ", $scope.user_data )
					// document.getElementById( 'quickstart-sign-in-status' ).textContent = 'Signed out';
					// document.getElementById( 'quickstart-sign-in' ).textContent = 'Sign in';
					// document.getElementById( 'quickstart-account-details' ).textContent = 'null';
					// [END_EXCLUDE]
			}
			// [START_EXCLUDE silent]
			// document.getElementById( 'quickstart-sign-in' ).disabled = false;
			$scope.signinable = false
				// [END_EXCLUDE]
			$scope.$apply( )
		} );
		// [END authstatelistener]

		// document.getElementById( 'quickstart-sign-in' ).addEventListener( 'click', toggleSignIn, false );
		// document.getElementById( 'quickstart-sign-up' ).addEventListener( 'click', handleSignUp, false );
		// document.getElementById( 'quickstart-verify-email' ).addEventListener( 'click', sendEmailVerification, false );
		// document.getElementById( 'quickstart-password-reset' ).addEventListener( 'click', sendPasswordReset, false );
	}

	$scope.updateDisplayName = function ( )
	{

		var user = firebase.auth( ).currentUser;

		var displayName = $scope.input.displayName

		user.updateProfile(
		{
			displayName: displayName
		} ).then( function ( )
		{
			$state.go( 'tab.dash' )
			console.log( "update success " + displayName )
		}, function ( error )
		{
			console.log( error )
		} );
	};

	// window.onload = function ( )
	// {
	$scope.initApp( );
	// };


} )

//////////////////////////////////
//LoginCtrl end
//////////////////////////////////


//////////////////////////////////
//FromCtrl start
//////////////////////////////////

app.controller( 'FromCtrl', function ( $scope )
{
	// Initialize Firebase
	$scope.fb_value = "testing"
	read_ref = firebase.database( ).ref( )
	set_ref = firebase.database( ).ref( 'level1/' )

	// set_ref.set(
	// {
	// 	"l1 subkey1": "timestamp = 1"
	// } );



	// read_ref.once( 'value', function ( snap )
	// {
	// 	$scope.fb_value = pretty( snap.val( ) )
	// 	console.log( "ooooooooooohhhhhh snap", snap.val( ) )
	// } )
	uuid = '6X2Yka97bOOomPD1cN9VDj9VryK2'
		// var ref = firebase.database( ).ref( "/johnny/data/groups/" );
		// var ref = ref.orderByChild( "has_changed" ).equalTo( true );
		// var ref = ref.child( "uuid" );
		// ref.once( "value", function ( data )
		// {
		// 	console.log( data.val( ) )
		// } );

	firebase.database( )
		.ref( '/johnny/data/users/' + uuid + '/groups' ).once( 'value', function ( data )
		{
			angular.forEach( data.val( ), function ( value, index )
			{

				console.log( index, value )
				var ref = firebase.database( ).ref( "/johnny/data/groups/" );
				var ref = ref.orderByChild( "has_changed" ).equalTo( true );
				ref.once( "value", function ( data )
				{
					console.log( data.val( ) )
				} );
			} );
		} );

	// firebase.database( )
	// 	.ref( '/johnny/data/users/6X2Yka97bOOomPD1cN9VDj9VryK2/groups' ).once( 'value', function ( snap )
	// 	{
	// 		angular.forEach( snap.val( ), function ( value, index )
	// 		{
	// 			console.log( value.key )
	// 			firebase.database( )
	// 				.ref( '/johnny/data/groups/' )
	// 				.child( value.key )
	// 				.orderByChild( 'has_changed' )
	// 				.startAt( 'true' ).endAt( 'true' )
	// 				// .orderBy('lead')                  // !!! THIS LINE WILL RAISE AN ERROR !!!
	// 				// .startAt('Jack Nicholson').endAt('Jack Nicholson')
	// 				// .orderByChild( 'has changed' )
	// 				// .child( 'has changed' )
	// 				// .equalTo( 'true' )
	// 				.once( 'value', function ( snap )
	// 				{
	// 					// console.log( key, value );
	// 					console.log( 'Group == ', snap.val( ) );
	// 				} );
	// 		} );


	// 	} );


} )

//////////////////////////////////
//FromCtrl end
//////////////////////////////////

