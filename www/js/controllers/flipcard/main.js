//////////////////////////////////
//FlipCtrl start
//////////////////////////////////

app.controller( 'FlipCtrl', function ( $scope, Firebase )
{

	$scope.groups = {}
	uuid = 'Ucg7kUNTceQjOLqDIwByHLz5FPj2'
	Firebase.get_user_groups( uuid ).then( function ( data )
		{
			group_ids = data.val( )
			Firebase.get_groups( group_ids ).then( function ( groups )
			{
				for ( var i = 0; i < groups.length; i++ )
				{
					console.info( groups[ i ].val( ) )
				}
			} )
		} )
		// firebase.database( )
		// 	.ref( `/johnny/users/${uuid}/groups` ).once( 'value', function ( data )
		// 	{
		// 		console.log( "[Users]", data.val( ) )
		// 		counter = 0
		// 		angular.forEach( data.val( ), function ( value, index )
		// 		{
		// 			// if ( value.read ) return;
		// 			console.log( index )
		// 			var ref = firebase.database( ).ref( `/johnny/groups/${index}` );
		// 			// 	var ref = ref.orderByChild( "has_changed" ).equalTo( true );
		// 			ref.once( "value", function ( data )
		// 			{
		// 				console.log( "[Groups]", data.val( ) )

	// 				$scope.groups[ counter++ ] = data.val( )
	// 				console.warn( $scope.groups )
	// 			} );
	// 		} );
	// 	} );
	// $scope.flip = function ( group_key, pad_key )
	// {
	// 	if ( typeof ( $scope.groups[ group_key ].pads[ pad_key ].flipped ) === "undefeined" )
	// 	{
	// 		$scope.groups[ group_key ].pads[ pad_key ].flipped = false;
	// 	}
	// 	$scope.groups[ group_key ].pads[ pad_key ].flipped = !$scope.groups[ group_key ].pads[ pad_key ].flipped
	// }


} );

//////////////////////////////////
//FlipCtrl end
//////////////////////////////////

