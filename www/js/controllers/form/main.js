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
	uuid = 'Ucg7kUNTceQjOLqDIwByHLz5FPj2'
	firebase.database( )
		.ref( `/johnny/users/${uuid}/groups` ).once( 'value', function ( data )
		{
			console.log( "[Users]", data.val( ) )
			angular.forEach( data.val( ), function ( value, index )
			{
				if ( value.read ) return;
				console.log( index )
				var ref = firebase.database( ).ref( `/johnny/groups/` )
				ref = ref.equalTo( index );
				console.log( ref )
					// 	var ref = ref.orderByChild( "has_changed" ).equalTo( true );
				ref.once( "value", function ( data )
				{
					console.log( "[Groups]", data.val( ) )
				} );
			} );
		} );


	// read_ref.once( 'value', function ( snap )
	// {
	// 	$scope.fb_value = pretty( snap.val( ) )
	// 	console.log( "ooooooooooohhhhhh snap", snap.val( ) )
	// } )
	// var ref = firebase.database( ).ref( "/johnny/data/groups/" );
	// var ref = ref.orderByChild( "has_changed" ).equalTo( true );
	// var ref = ref.child( "uuid" );
	// ref.once( "value", function ( data )
	// {
	// 	console.log( data.val( ) )
	// } );

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

