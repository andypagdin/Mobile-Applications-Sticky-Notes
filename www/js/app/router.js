//////////////////////////////////
//router start
//////////////////////////////////

app.config( function ( $stateProvider, $urlRouterProvider ) {
    $stateProvider
        .state( 'auth', {
            url: '/auth',
            templateUrl: 'templates/auth.html',
            controller: 'AuthCtrl'
        } )
        .state( 'login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        } )
        .state( 'accordion', {
            url: '/accordion',
            templateUrl: 'templates/accordion.html',
            controller: 'AccordionCtrl'
        } )
        .state( 'editPad', {
            url: '/edit',
            templateUrl: 'templates/editPad.html',
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
            templateUrl: 'templates/flip.html',
            controller: 'FlipCtrl'
        } )
        .state( 'home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
        } )
        .state( 'tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        } )
        .state( 'tab.dash', {
            url: '/dash',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash.html',
                    controller: 'DashCtrl'
                }
            }
        } )
        .state( 'addPad', {
            url: '/addPad',
            templateUrl: 'templates/addPad.html',
            controller: 'addPadCtrl'
        } )
        .state( 'nav', {
            url: '/nav',
            templateUrl: 'templates/nav.html',
            controller: 'NavCtrl'
        } )
        .state( 'tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account.html',
                    controller: 'AccountCtrl'
                }
            }
        } );
    $urlRouterProvider.otherwise( '/login' );

} );

//////////////////////////////////
//router end
//////////////////////////////////
