//////////////////////////////////
//SettingsCtrl start
//////////////////////////////////

app.controller( 'SettingsCtrl', ( $scope, FirebaseServ, $timeout, $state ) =>
{
    const app = angular.module( 'myApp', [ ] );
    $scope.today = new Date( );
    $scope.signOut = ( ) =>
    {
        firebase.auth( ).signOut( ).then( ( ) =>
        {
            $state.go( 'auth' )
            console.log( "signed out" )
        }, error =>
        {
            console.log( error )
        } );
    }
} )

//////////////////////////////////
//SettingsCtrl end
//////////////////////////////////
