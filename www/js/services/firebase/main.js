//////////////////////////////////
//firebaseServ start
//////////////////////////////////

app.factory( 'Firebase', function ( $q )
{
	get_user_groups = function ( uuid )
	{
		console.info( "get_user_groups", uuid )
		return firebase.database( ).ref( `/users/${uuid}/groups` ).once( 'value', function ( data )
		{
			return data;
		} )
	}
	get_groups = function ( group_ids )
	{
		// counter = 0
		console.info( "get_groups", group_ids )
		groups = [ ]
		angular.forEach( group_ids, function ( group_object, group_id )
		{
			if ( !group_object.read )
			{
				groups.push( firebase.database( ).ref( `/groups/${group_id}` ).once( "value", function ( data )
				{
					return data.val( )
				} ) );
			}
		} );
		return $q.all( groups );
	}
	post_comment = function ( arg )
	{
		console.info( "args", arg )
		arg.user_id
		arg.sent
		arg.group_id
		arg.pad_id
		arg.comment
		arg.comment_id = 123

		comment_output = {
			content: arg.comment,
			comment_id: String( arg.sent ),
			sent: arg.sent,
			user_id: arg.user_id
		}
		console.info( "comment_output", comment_output )


		set = firebase.database( ).ref( `/groups/${arg.group_id}/pads/${arg.pad_id}/comments/${comment_output.user_id}` ).set( comment_output );

		console.info( "set", set )

		firebase.database( ).ref( `/groups/${arg.group_id}/pads/${arg.pad_id}/comments` ).once( "value", function ( data )
			{
				console.log( data.val( ) )
			} )
			// firebase.database( ).ref( `/groups/${group_id}` ).set(
			// {
			// 	username: name,
			// 	email: email,
			// 	profile_picture: imageUrl
			// } );
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
		get_groups: get_groups,
		post_comment: post_comment
	};
} );

//////////////////////////////////
//firebaseServ end
//////////////////////////////////

