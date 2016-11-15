//////////////////////////////////
//FlipCtrl start
//////////////////////////////////
app.controller('FlipCtrl', function ($scope, Firebase) {
    //this would be set by auth instead of hard coded
    uuid = 'Ucg7kUNTceQjOLqDIwByHLz5FPj2'
    $scope.groups = {}
    $scope.comment_data = {
        pad_id: "",
        comment: "",
        user_id: uuid
    }

    Firebase.get_user_groups(uuid).then(function (data) {
        group_ids = data.val()
        console.log("group_ids", group_ids)
        Firebase.get_groups(group_ids)
            .then(function (groups) {
                $scope.groups = groups
                console.log("$scope.groups", $scope.groups)
            })
    })
    $scope.trigger_comment = function (element) {
        var output = {
            user_id: uuid,
            sent: Date.now(),
            group_id: element.$parent.group_key,
            pad_id: element.pad_key,
            comment: element.pad.new_comment
        }
        var comment_data = $scope.groups
        Firebase.post_comment(output)
    }

    $scope.flip = function (group_key, pad_key) {
        if (typeof ($scope.groups[group_key].pads[pad_key].flipped) === "undefeined") {
            $scope.groups[group_key].pads[pad_key].flipped = false;
        }
        $scope.groups[group_key].pads[pad_key].flipped = !$scope.groups[group_key].pads[pad_key].flipped
    }


});

//////////////////////////////////
//FlipCtrl end
//////////////////////////////////

