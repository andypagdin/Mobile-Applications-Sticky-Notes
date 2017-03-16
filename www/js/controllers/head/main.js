app.controller( 'headCtrl', function ( $scope, Css) {

	$scope.cssOptions = [
	    { name: 'Default', value: 'style' },
	    { name: 'Dark', value: 'dark-style' },
	    { name: 'Colour Blind', value: 'assisted-style' }
	];

	$scope.Css = Css;

   	$scope.changePath = function() {
   		if($scope.css == "style"){
   			Css.setUrl('css/style');
   		}
   		else if($scope.css == "dark-style")
   		{
   			Css.setUrl('css/dark-style');
   		}
   		else if($scope.css == "assisted-style")
   		{
   			Css.setUrl('css/assisted-style');
   		}
   		//console.log($scope.css)
  	};

} )