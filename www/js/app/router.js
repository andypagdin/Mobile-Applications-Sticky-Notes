//////////////////////////////////
//router start
//////////////////////////////////

app.config( function ( $stateProvider, $urlRouterProvider )
{

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider
		.state( 'login',
		{
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl'
		} )



	.state( 'name',
	{
		url: '/name',
		templateUrl: 'templates/login-name.html',
		controller: 'LoginCtrl'
	} )

	.state( 'accordion',
	{
		url: '/accordion',
		templateUrl: 'templates/accordion.html',
		controller: 'AccordionCtrl'
	} )

	.state( 'editPad',
	{
		url: '/edit',
		templateUrl: 'templates/editPad.html',
		controller: 'EditPadCtrl',
		params: { pad_id: null,
				  title: null,
				  body: null,
				  group_id: null,
				  created_by: null,
				  timestamp: null },
	} )

	.state( 'test',
	{
		url: '/test',
		templateUrl: 'templates/test.html',
		controller: 'testCtrl'
	} )

	.state( 'forms',
	{
		url: '/forms',
		templateUrl: 'templates/forms.html',
		controller: 'FromCtrl'
	} )

	.state( 'flip',
	{
		url: '/flip',
		templateUrl: 'templates/flip.html',
		controller: 'FlipCtrl'
	} )

	// setup an abstract state for the tabs directive
	.state( 'tab',
	{
		url: '/tab',
		abstract: true,
		templateUrl: 'templates/tabs.html'
	} )

	// Each tab has its own nav history stack:

	.state( 'tab.dash',
	{
		url: '/dash',
		views:
		{
			'tab-dash':
			{
				templateUrl: 'templates/tab-dash.html',
				controller: 'DashCtrl'
			}
		}
	} )

	.state( 'tab.chats',
		{
			url: '/chats',
			views:
			{
				'tab-chats':
				{
					templateUrl: 'templates/tab-chats.html',
					controller: 'ChatsCtrl'
				}
			}
		} )
		.state( 'tab.chat-detail',
		{
			url: '/chats/:chatId',
			views:
			{
				'tab-chats':
				{
					templateUrl: 'templates/chat-detail.html',
					controller: 'ChatDetailCtrl'
				}
			}
		} )

	.state( 'addPad',
	{
		url: '/addPad',
		templateUrl: 'templates/addPad.html',
		controller: 'addPadCtrl'
	} )

	.state( 'nav',
	{
		url: '/nav',
		templateUrl: 'templates/nav.html',
		controller: 'NavCtrl'
	} )

	.state( 'tab.account',
	{
		url: '/account',
		views:
		{
			'tab-account':
			{
				templateUrl: 'templates/tab-account.html',
				controller: 'AccountCtrl'
			}
		}
	} );

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise( '/login' );

} );

//////////////////////////////////
//router end
//////////////////////////////////

