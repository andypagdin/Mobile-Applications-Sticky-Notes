//////////////////////////////////
// !!!WARNING!!! - JH
// -------------------------------
// If you are editing this in the services.js file don't! 
// Becuase as soon as the gulp process runs you work will be over written!!!
// Please edit the indavidual files in /www/js/services/..
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
app = angular.module( 'starter.services', [ ] )

//////////////////////////////////
//base end
//////////////////////////////////


//////////////////////////////////
//chatsServ start
//////////////////////////////////

app.factory( 'Chats', function ( )
{
	// Might use a resource here that returns a JSON array
	// Some fake testing data
	var chats = [
	{
		id: 0,
		name: 'Ben Sparrow',
		lastText: 'You on your way?',
		face: 'img/ben.png'
	},
	{
		id: 1,
		name: 'Max Lynx',
		lastText: 'Hey, it\'s me',
		face: 'img/max.png'
	},
	{
		id: 2,
		name: 'Adam Bradleyson',
		lastText: 'I should buy a boat',
		face: 'img/adam.jpg'
	},
	{
		id: 3,
		name: 'Perry Governor',
		lastText: 'Look at my mukluks!',
		face: 'img/perry.png'
	},
	{
		id: 4,
		name: 'Mike Harrington',
		lastText: 'This is wicked good ice cream.',
		face: 'img/mike.png'
	} ];

	return {
		all: function ( )
		{
			return chats;
		},
		remove: function ( chat )
		{
			chats.splice( chats.indexOf( chat ), 1 );
		},
		get: function ( chatId )
		{
			for ( var i = 0; i < chats.length; i++ )
			{
				if ( chats[ i ].id === parseInt( chatId ) )
				{
					return chats[ i ];
				}
			}
			return null;
		}
	};
} );

//////////////////////////////////
//chatsServ end
//////////////////////////////////


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

