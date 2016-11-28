//////////////////////////////////
//FlipCtrl start
//////////////////////////////////
app.controller('FlipCtrl', function ($scope, Firebase) {

    $scope.page_data = {}
    $scope.page_data.groups = {}
    $scope.page_data.group_models = {}
    $scope.page_data.edit_group_models = {}
    $scope.page_data.pad_models = {}
    $scope.page_data.comment_models = {}
    var group_ids = {}

    Firebase.get_user_groups().then(function (outcome) {
        if (outcome.groups) {
            console.log("groups", outcome)
            $scope.get_groups(outcome)
        }
        else {
            console.log("users", outcome)
            input.groups = {
                general: true,
            }
            Firebase.create_user(outcome)
        }
    })
    $scope.get_groups = function (input) {
        Firebase.get_groups(input.groups)
            .then(function (groups) {
                console.warn("LIST OF ALL GROUPS", groups)
                $scope.page_data.groups = groups
                $scope.page_data.uid = input.uid
            })
    }
    $scope.remove_group = function (group_id) {
        var input = {
            group_id: group_id,
        }
        Firebase.remove_group(input).then(function (output) {
            delete $scope.page_data.groups[group_id]
            $scope.page_data.groups.length--
            if (!$scope.$$phase) {
                $scope.$apply()
            }
        })
    }
    $scope.update_group = function (group_id) {
        console.warn('update group')
        var title = $scope.page_data.edit_group_models[group_id]
        var input = $scope.page_data.groups[group_id]
        input.title = title
        console.log("input", input)
        $scope.page_data.edit_group_models[group_id] = "";
        Firebase.update_group(input)
            .then(function (output) {
                group_object = $scope.page_data.groups[output.id]
                group_object.title = output.title
                group_object.timestamp = output.timestamp
                console.log("group_object", group_object)
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    $scope.create_group = function () {
        var title = $scope.page_data.group_models.title
        var input = {
            title: title,
        }
        $scope.page_data.group_models.title = "";
        Firebase.post_group(input)
            .then(function (new_object) {
                group_object = $scope.page_data.groups
                if (!group_object) {
                    group_object = {}
                    group_object.length = 0
                }
                group_object[new_object.id] = {}
                group_object[new_object.id] = new_object
                group_object.length++
                console.log("group_object", group_object)
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    $scope.remove_pad = function (group_id, pad_id) {
        var input = {
            group_id: group_id,
            pad_id: pad_id,
        }
        Firebase.remove_pad(input).then(function (output) {
            delete $scope.page_data.groups[group_id].pads[pad_id]
            $scope.page_data.groups[group_id].pads.length--
            if (!$scope.$$phase) {
                $scope.$apply()
            }
        })
    }
    $scope.create_pad = function (group_id) {
        var title = $scope.page_data.pad_models[group_id].title
        var body = $scope.page_data.pad_models[group_id].body
        var input = {
            group_id: group_id,
            title: title,
            body: body,
        }
        $scope.page_data.pad_models[group_id].title = "";
        $scope.page_data.pad_models[group_id].body = "";
        Firebase.post_pad(input)
            .then(function (new_object) {
                pads_object = $scope.page_data.groups[group_id].pads
                if (!pads_object) {
                    pads_object = {}
                    pads_object.length = 0
                }
                pads_object[new_object.id] = {}
                pads_object[new_object.id] = new_object
                pads_object.length++
                console.log("pads_object", pads_object)
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    $scope.remove_comment = function (group_id, pad_id, comment_id) {
        var input = {
            group_id: group_id,
            pad_id: pad_id,
            comment_id: comment_id,
        }
        Firebase.remove_comment(input).then(function (output) {
            delete $scope.page_data.groups[group_id].pads[pad_id].comments[comment_id]
            $scope.page_data.groups[group_id].pads[pad_id].comments.length--
            if (!$scope.$$phase) {
                $scope.$apply()
            }
        })
    }
    $scope.create_comment = function (group_id, pad_id) {
        var body = $scope.page_data.comment_models[pad_id].body
        var input = {
            group_id: group_id,
            pad_id: pad_id,
            body: body,
        }
        $scope.page_data.comment_models[pad_id].body = "";
        Firebase.post_comment(input)
            .then(function (new_object) {
                comments_object = $scope.page_data.groups[input.group_id].pads[input.pad_id].comments
                if (!comments_object) {
                    comments_object = {}
                    comments_object.length = 0
                }
                comments_object[new_object.id]
                comments_object[new_object.id] = new_object
                comments_object.length++
                console.log("comments_object", comments_object)
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
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

