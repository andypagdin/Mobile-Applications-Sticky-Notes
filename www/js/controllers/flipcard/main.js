//////////////////////////////////
//FlipCtrl start
//////////////////////////////////

app.controller( 'FlipCtrl', function ( $scope, Firebase )
{
	//this would be set by auth instead of hard coded
	uuid = 'Ucg7kUNTceQjOLqDIwByHLz5FPj2'
	$scope.groups = {}
	$scope.comment_data = {
		pad_id: "",
		comment: "",
		user_id: uuid
	}
	console.log( $scope.comment_data )
	Firebase.get_user_groups( uuid ).then( function ( data )
	{
		group_ids = data.val( )
		Firebase.get_groups( group_ids ).then( function ( groups )
		{
			groups.forEach( function ( group, key )
			{
				$scope.groups[ group.val( ).group_id ] = group.val( )
			} );
			//just to get len -.-
			angular.forEach( $scope.groups, function ( group_obj, group_key )
			{
				angular.forEach( group_obj.pads, function ( pad_obj )
				{
					pad_obj.comments.length = Object.keys( pad_obj.comments ).length
					pad_obj.new_comment = ""
				} );
			} );
			console.info( $scope.groups )
			console.info( $scope.avalible_pads )
		} )
	} )
	$scope.trigger_comment = function ( element )
	{
		var output = {
			user_id: uuid,
			sent: Date.now( ),
			group_id: element.$parent.group_key,
			pad_id: element.pad_key,
			comment: element.pad.new_comment
		}
		var comment_data = $scope.groups
		Firebase.post_comment( output )
	}

	$scope.flip = function ( group_key, pad_key )
	{
		if ( typeof ( $scope.groups[ group_key ].pads[ pad_key ].flipped ) === "undefeined" )
		{
			$scope.groups[ group_key ].pads[ pad_key ].flipped = false;
		}
		$scope.groups[ group_key ].pads[ pad_key ].flipped = !$scope.groups[ group_key ].pads[ pad_key ].flipped
	}


} );

//////////////////////////////////
//FlipCtrl end
//////////////////////////////////

