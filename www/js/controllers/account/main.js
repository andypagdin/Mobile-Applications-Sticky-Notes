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
			$scope.photoURL = user.photoURL

			var isVerified = user.emailVerified

			if ( user.emailVerified )
			{
				$scope.isVerified = "You have verified your account";
			}
			else
			{
				$scope.isVerified = "You have not verified your account";
				btnVerifyEmail.classList.remove('hide');
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
			$state.go( 'auth' )
			console.log( "signed out" )
		}, function ( error )
		{
			console.log( error )
		} );
	}

	$scope.settings = {
		enableFriends: true
	};

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
} );

//////////////////////////////////
//AccountCtrl end
//////////////////////////////////

