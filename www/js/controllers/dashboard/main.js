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

