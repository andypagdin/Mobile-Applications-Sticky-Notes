//////////////////////////////////
//AccordionCtrl start
//////////////////////////////////

app.controller('AccordionCtrl', function ($scope, Firebase) {

  // $scope.page_data.groups = [];
  // for (var i = 0; i < 20; i++) {
  //   $scope.page_data.groups[i] = {
  //     name: i,
  //     items: []
  //   };
  //   for (var j = 0; j < 3; j++) {
  //     $scope.page_data.groups[i].items.push(i + '-' + j);
  //   }
  // }
$scope.page_data = {}
  $scope.page_data.groups = {}
  $scope.page_data.comment_models = {}
  var group_ids = {}
  uid = Firebase.uid(true)
  Firebase.check_user(uid).then(function (data) {
    user_details = data

    console.log("user_details", user_details)
    $scope.check_user(user_details.groups)
  })

  $scope.get_user_groups = function (group_ids) {
    console.log("group_ids", group_ids)
    Firebase.check_user(group_ids)
      .then(function (groups) {
        console.log("groups", groups)
        $scope.page_data.groups = groups
      })
  }


  //togglestar
  $scope.toggleStar = function (group) {
    group.star = !group.star;
  }
  //delete function
  $scope.onItemDelete = function (group) {
    delete $scope.page_data.groups[group]
  }
  //ReOrder function
  $scope.moveItem = function (group, fromIndex, toIndex) {
    $scope.page_data.groups.splice(fromIndex, 1);
    $scope.page_data.groups.splice(toIndex, 0, group);

  };
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function (group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };
});

//////////////////////////////////
//AccordionCtrl end
//////////////////////////////////
