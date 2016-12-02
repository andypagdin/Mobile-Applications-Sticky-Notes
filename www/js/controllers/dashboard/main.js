//////////////////////////////////
//DashCtrl start
//////////////////////////////////

app.controller('DashCtrl', function ($scope, $state) {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			$scope.signed_out = false
			$scope.displayName = user.displayName
		}
		else {
			$state.go( 'login' );
			$scope.signed_out = true
		}
	});
	$scope.sign_out = function () {
		firebase.auth().signOut().then(function () {
			console.log('Signed Out');
		}, function (error) {
			console.error('Sign Out Error', error);
		});
	}
});

//////////////////////////////////
//DashCtrl end
//////////////////////////////////

