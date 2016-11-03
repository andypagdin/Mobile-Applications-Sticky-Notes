//////////////////////////////////
//FlipCtrl start
//////////////////////////////////

app.controller( 'FlipCtrl', function ( $scope )
{
	$scope.cards = [
	{
		"title": "Card 1",
		"flipped": false
	},
	{
		"title": "Card 2",
		"flipped": false
	},
	{
		"title": "Card 3",
		"flipped": false
	},
	{
		"title": "Card 4",
		"flipped": false
	} ]
	$scope.flipped = false
	$scope.flip = function ( key )
	{
		$scope.cards[ key ].flipped = !$scope.cards[ key ].flipped
		console.log( "flipp?", $scope.flipped )
	}


} );

//////////////////////////////////
//FlipCtrl end
//////////////////////////////////

