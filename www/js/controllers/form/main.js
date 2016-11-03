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

