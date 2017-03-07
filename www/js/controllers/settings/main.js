//////////////////////////////////
//SettingsCtrl start
//////////////////////////////////

app.controller( 'SettingsCtrl', function ( $scope, FirebaseServ, $timeout, $state ) {

var app = angular.module('myApp', []);
$scope.today = new Date();

$scope.signOut = function ( )
{
	firebase.auth( ).signOut( ).then( function ( )
	{
		$state.go( 'auth' )
		console.log( "signed out" )
	}, function ( error )
	{
		console.log( error )
	} );
}

} )

//////////////////////////////////
//SettingsCtrl end
//////////////////////////////////
