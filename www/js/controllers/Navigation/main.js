app.controller( 'NavCtrl', function ( $scope, $location )
{
	$scope.go = function ( path ) {
    $location.path( path );
  };
} );