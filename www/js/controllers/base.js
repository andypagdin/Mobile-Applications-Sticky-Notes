//////////////////////////////////
// !!!WARNING!!! - JH
// -------------------------------
// If you are editing this in the controllers.js file don't! 
// Becuase as soon as the gulp process runs you work will be over written!!!
// Please edit the indavidual files in /www/js/controllers/..
//////////////////////////////////


//////////////////////////////////
//base start
//////////////////////////////////


//////////////////////////////////
// Information - JH
// -------------------------------
// I add app = to the angular.modules( 'bla', [ 'bla', 'bla', 'bla'])
// Becuase if anything that doesnt start with .whatever will break the app
// But! By assigning it to a var it always knows what its base module is!
//////////////////////////////////
app = angular.module( 'starter.controllers', [ ] )

// app.run( function ( $rootScope )
// {
//     $rootScope.$on( "$locationChangeStart", function ( event, next, current )
//     {
//         var current_page = document.location.hash.replace( "#/", "" )
//         console.log( "event", event )
//         console.log( "next", next )
//         console.log( "current", current )
//         console.log( "current_page", current_page )
//     } );
// } ); 
//inject indavidual controllers here!

////////////////////////////////// 
//base end
//////////////////////////////////
