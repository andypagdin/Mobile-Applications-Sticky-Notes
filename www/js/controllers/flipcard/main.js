//////////////////////////////////
//FlipCtrl start
//////////////////////////////////
app.controller('FlipCtrl', function ($scope, Firebase) {
    //this would be set by auth instead of hard coded
    uuid = 'Ucg7kUNTceQjOLqDIwByHLz5FPj2'
    $scope.page_data = {}
    $scope.page_data.groups = {}
    $scope.page_data.comment_models = {}
    var group_ids = {}

    Firebase.get_user(uuid).then(function (data) {
        user_details = data.val()
        $scope.get_groups(user_details.groups)
    })
    $scope.get_groups = function (group_ids) {
        Firebase.get_groups(group_ids)
            .then(function (groups) {
                $scope.page_data.groups = groups
            })
    }
    $scope.trigger_comment = function (group_id, pad_id) {
        var input = {
            group_id: group_id,
            pad_id: pad_id,
            body: $scope.page_data.comment_models[pad_id].body
        }
        $scope.page_data.comment_models[pad_id].body = "";
        Firebase.post_comment(input)
            .then(function (new_comment) {
                comments_object = $scope.page_data.groups[input.group_id].pads[input.pad_id].comments_object
                comments_object[output.id] = new_comment
                comments_object.length++
                $scope.$apply()
            })
    }

    $scope.flip = function (group_id, pad_key) {
        pads_object = $scope.page_data.groups[group_id].pads[pad_key]
        if (typeof (pads_object.flipped) === "undefeined") {
            pads_object.flipped = false;
        }
        pads_object.flipped = !pads_object.flipped
    }


});

//////////////////////////////////
//FlipCtrl end
//////////////////////////////////

