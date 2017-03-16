//////////////////////////////////
// !!!WARNING!!! - JH
// -------------------------------
// If you are editing this in the services.js file don't! 
// Becuase as soon as the gulp process runs you work will be over written!!!
// Please edit the indavidual files in /www/js/services/..
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
app = angular.module( 'starter.services', [ ] )

//////////////////////////////////
//base end
//////////////////////////////////
