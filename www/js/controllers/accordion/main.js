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

  // Firebase.uid(true) gets uid
  // Firebase.uid() gets full user object
  // uid = Firebase.uid(true)

  // check user doesnt need a uid
  // Firebase.check_user(uid).then(function (data) {

    // user_details = data
    // console.log("user_details", user_details)

    // This wont work check user isnt in $scope its in Firebase
    // $scope/Firebase are like an objects but are at the same level
    // {$scope:{},Firebase:{}}
    // $scope.check_user(user_details.groups)

  // })


  Firebase.check_user().then(function (data) {
    user_details = data
    $scope.get_groups(data)
    console.log("user_details", user_details)
  })

  /*$scope.get_user_groups = function (group_ids) {
    console.log("group_ids", group_ids)
    Firebase.check_user(group_ids)
      .then(function (groups) {
        console.log("groups", groups)
        $scope.page_data.groups = groups
      })
  }*/

  $scope.get_groups = function (input) {
    // trigger Firebase function.
    Firebase.get_groups(input.groups)
        .then(function (groups) {
            console.info("input", input)
            console.info("groups", groups)
            $scope.groups = groups
        })
    }


  //togglestar
  $scope.toggleStar = function (group) {
    group.star = !group.star;
  }
  //delete function
  $scope.onItemDelete = function (group) {
    delete $scope.groups[group]
  }
  //ReOrder function
  $scope.moveItem = function (group, fromIndex, toIndex) {
    $scope.groups.splice(fromIndex, 1);
    $scope.groups.splice(toIndex, 0, group);

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
