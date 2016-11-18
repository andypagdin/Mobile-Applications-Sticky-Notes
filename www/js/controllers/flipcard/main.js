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
    var group_ids = {}

    Firebase.get_user_groups(uuid).then(function (data) {
        group_ids = data.val()
        console.log("group_ids", group_ids)
        $scope.get_groups(group_ids)
    })
    $scope.get_groups = function (group_ids) {
        Firebase.get_groups(group_ids)
            .then(function (groups) {
                console.log(groups)
                $scope.groups = groups
                console.log("$scope.groups", $scope.groups)
            })
    }
    $scope.trigger_comment = function (group_id, element) {
        var output = {
            user_id: uuid,
            sent: Date.now(),
            group_id: group_id,
            pad_id: element.$parent.pad_key,
            comment: element.$parent.pad.new_comment
        }
        Firebase.post_comment(output)
            .then(function (comment_id) {
                $scope.groups[output.group_id].pads[output.pad_id].comments[comment_id] = {}
                $scope.groups[output.group_id].pads[output.pad_id].comments[comment_id].comment_id = comment_id
                $scope.groups[output.group_id].pads[output.pad_id].comments[comment_id].content = output.comment
                $scope.groups[output.group_id].pads[output.pad_id].comments[comment_id].sent = output.sent
                $scope.groups[output.group_id].pads[output.pad_id].comments[comment_id].user_id = output.user_id
                $scope.groups[output.group_id].pads[output.pad_id].comments.length++
                $scope.$apply()
            })
    }

    $scope.flip = function (group_id, pad_key) {
        console.log(group_id)
        console.log($scope.groups[group_id])
        if (typeof ($scope.groups[group_id].pads[pad_key].flipped) === "undefeined") {
            $scope.groups[group_id].pads[pad_key].flipped = false;
        }
        $scope.groups[group_id].pads[pad_key].flipped = !$scope.groups[group_id].pads[pad_key].flipped
    }


});

//////////////////////////////////
//FlipCtrl end
//////////////////////////////////

