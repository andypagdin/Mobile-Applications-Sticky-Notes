//////////////////////////////////
//EditPadCtrl start
//////////////////////////////////

app.controller( 'EditPadCtrl', function ( $scope, $state, Firebase, $stateParams)
{
	$scope.pad_id = $stateParams.pad_id
	$scope.title = $stateParams.title
	$scope.body = $stateParams.body
	$scope.group_id = $stateParams.group_id

	$scope.goBack = function () {
		$state.go("tab.dash")
	}

	// Not working yet
	$scope.updateNote = function ($body) {
		console.log($body)
	}

} );

//////////////////////////////////
//EditPadCtrl end
//////////////////////////////////

