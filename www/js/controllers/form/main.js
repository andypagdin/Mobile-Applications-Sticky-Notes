//////////////////////////////////
//FromCtrl start
//////////////////////////////////

app.controller( 'FromCtrl', function ( $scope )
{
	// Initialize Firebase
	$scope.fb_value = "testing"
	read_ref = firebase.database( ).ref( )
	set_ref = firebase.database( ).ref( 'level1/' )

	set_ref.set(
	{
		"l1 subkey1": "timestamp = 1"
	} );

	read_ref.on( 'value', function ( snap )
	{
		$scope.fb_value = pretty( snap.val( ) )
		console.log( "snap", snap.val( ) )
	} )
} )

//////////////////////////////////
//FromCtrl end
//////////////////////////////////

