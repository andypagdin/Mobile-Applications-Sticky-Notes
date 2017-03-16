//////////////////////////////////
//router start
//////////////////////////////////

app.config( function ( $stateProvider, $urlRouterProvider, $ionicConfigProvider )
{
    //testing
    $ionicConfigProvider.platform.android.tabs.position( 'bottom' );
    var cache_buster = Math.floor( Date.now( ) / 1000 )
    $stateProvider
        .state( 'tab',
        {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html?cb=' + cache_buster
        } )
        .state( 'auth',
        {
            url: '/auth',
            templateUrl: 'templates/auth.html?cb=' + cache_buster,
            controller: 'AuthCtrl'
        } )
        .state( 'tab.home',
        {
            url: '/home',
            views:
            {
                'tab-home':
                {
                    templateUrl: 'templates/tab-home.html?cb=' + cache_buster,
                    controller: 'HomeCtrl'
                }
            }
        } )
        .state( 'tab.settings',
        {
            url: '/settings',
            views:
            {
                'tab-settings':
                {
                    templateUrl: 'templates/tab-settings.html?cb=' + cache_buster,
                    controller: 'SettingsCtrl'
                }
            }
        } )
    $urlRouterProvider.otherwise( '/auth' );

} );

//////////////////////////////////
//router end
//////////////////////////////////
