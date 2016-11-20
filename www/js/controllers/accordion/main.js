//////////////////////////////////
//AccordionCtrl start
//////////////////////////////////

app.controller( 'AccordionCtrl', function ( $scope )
{

	$scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
     
     //togglestar
     $scope.toggleStar = function(group){
     	group.star = !group.star;
     }
     //delete function 
     $scope.onItemDelete = function(group){
     	$scope.groups.splice($scope.groups.indexOf(group), 1);
     } 
	//ReOrder function
    $scope.moveItem = function(group, fromIndex, toIndex){
    $scope.groups.splice(fromIndex, 1);
    $scope.groups.splice(toIndex, 0, group);

      };
    
    }   
  
  }
   
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;  

    
   
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;  

  };
} );

//////////////////////////////////
//AccordionCtrl end
//////////////////////////////////
