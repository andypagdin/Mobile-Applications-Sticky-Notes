//////////////////////////////////
//EditPadCtrl start
//////////////////////////////////

app.controller( 'EditPadCtrl', function ( $scope, $state, Firebase, $stateParams )
{
	$scope.id = $stateParams.id
	$scope.title = $stateParams.title
	$scope.body = $stateParams.body

	$scope.goBack = function () {
		$state.go("tab.dash")
	}

} );

//////////////////////////////////
//EditPadCtrl end
//////////////////////////////////

