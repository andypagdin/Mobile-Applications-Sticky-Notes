//////////////////////////////////
//firebaseServ start
//////////////////////////////////

app.factory( 'Firebase', function ( $q )
{
	get_user_groups = function ( uuid )
	{
		return firebase.database( ).ref( `/johnny/users/${uuid}/groups` ).once( 'value', function ( data )
		{
			return data;
		} )
	}
	get_groups = function ( group_ids )
	{
		// counter = 0
		groups = [ ]
		angular.forEach( group_ids, function ( value, group_id )
		{
			groups.push( firebase.database( ).ref( `/johnny/groups/${group_id}` ).once( "value", function ( data )
			{
				// console.log( "[Groups]", data.val( ) )
				return data.val( )
			} ) );
		} );
		return $q.all( groups );
	}
	flat_stub = function ( )
	{
		return firebase.database( ).ref( "" ).once( 'value', function ( data )
		{
			return data;
		} )
	}
	return {
		get_user_groups: get_user_groups,
		get_groups: get_groups
	};
} );

//////////////////////////////////
//firebaseServ end
//////////////////////////////////

