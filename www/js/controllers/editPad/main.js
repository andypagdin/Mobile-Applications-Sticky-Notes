//////////////////////////////////
//EditPadCtrl start
//////////////////////////////////

app.controller( 'EditPadCtrl', function ( $scope, $state, Firebase, $stateParams)
{
	// Put state parameters into the scope
	$scope.pad_id = $stateParams.pad_id
	$scope.title = $stateParams.title
	$scope.body = $stateParams.body
	$scope.group_id = $stateParams.group_id
	$scope.created_by = $stateParams.created_by
	$scope.timestamp = $stateParams.timestamp

	$scope.goBack = function () {
		$state.go("tab.dash")
	}


	$scope.updateNote = function ( $body ) {
		firebase.database().ref('groups/' + $scope.group_id + '/pads/' + $scope.pad_id).set({
			body: $body,
			created_by: $scope.created_by,
			id: $scope.pad_id,
			timestamp: $scope.timestamp,
			title: $scope.title
		})
	}

} );

//////////////////////////////////
//EditPadCtrl end
//////////////////////////////////

