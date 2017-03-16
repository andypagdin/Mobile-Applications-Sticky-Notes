//////////////////////////////////
//router start
//////////////////////////////////

app.config( function ( $stateProvider, $urlRouterProvider, $ionicConfigProvider ) {
    $ionicConfigProvider.platform.android.tabs.position('bottom');
    var cache_buster = Math.floor( Date.now( ) / 1000 )
    $stateProvider
        .state( 'tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html?cb='+cache_buster
        } )
        .state( 'auth', {
            url: '/auth',
            templateUrl: 'templates/auth.html?cb='+cache_buster,
            controller: 'AuthCtrl'
        } )
        .state( 'login', {
            url: '/login',
            templateUrl: 'templates/login.html?cb='+cache_buster,
            controller: 'LoginCtrl'
        } )
        .state( 'accordion', {
            url: '/accordion',
            templateUrl: 'templates/accordion.html?cb='+cache_buster,
            controller: 'AccordionCtrl'
        } )
        .state( 'editPad', {
            url: '/edit',
            templateUrl: 'templates/editPad.html?cb='+cache_buster,
            controller: 'EditPadCtrl',
            params: {
                pad_id: null,
                title: null,
                body: null,
                group_id: null,
                created_by: null,
                timestamp: null
            },
        } )
        .state( 'flip', {
            url: '/flip',
            templateUrl: 'templates/flip.html?cb='+cache_buster,
            controller: 'FlipCtrl'
        } )
        .state( 'tab.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'templates/tab-home.html?cb='+cache_buster,
                    controller: 'HomeCtrl'
                }
            }
        } )
        .state( 'tab.settings', {
            url: '/settings',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/tab-settings.html?cb='+cache_buster,
                    controller: 'SettingsCtrl'
                }
            }
        } )
        // .state( 'tab.dash', {
        //     url: '/dash',
        //     views: {
        //         'tab-dash': {
        //             templateUrl: 'templates/tab-dash.html?cb='+cache_buster,
        //             controller: 'DashCtrl'
        //         }
        //     }
        // } )
        .state( 'addPad', {
            url: '/addPad',
            templateUrl: 'templates/addPad.html?cb='+cache_buster,
            controller: 'addPadCtrl'
        } )
        .state( 'nav', {
            url: '/nav',
            templateUrl: 'templates/nav.html?cb='+cache_buster,
            controller: 'NavCtrl'
        } )
        .state( 'tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account.html?cb='+cache_buster,
                    controller: 'AccountCtrl'
                }
            }
        } );
    $urlRouterProvider.otherwise( '/auth' );

} );

//////////////////////////////////
//router end
//////////////////////////////////
