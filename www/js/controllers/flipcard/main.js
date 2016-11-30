//////////////////////////////////
//FlipCtrl start
//////////////////////////////////
app.controller('FlipCtrl', function ($scope, Firebase) {
    //////////////////////////////////
    // Information - JH
    // -------------------------------
    // intro to function structure,
    // All Firebase.functions are asynchronous
    // because of this we use the .then() method
    // which returns once the Firebase function has finished running
    //////////////////////////////////

    // data related to the view is in $scope.page.data
    $scope.page = {}
    //core data for the page.
    $scope.page.data = {}
    // groups > pads > comments data for the page.
    $scope.page.data.groups = {}
    // current user id for the page.
    $scope.page.data.uid = ""
    // the values for tha page.
    $scope.page.models = {}
    // group models.
    $scope.page.models.group = {}
    $scope.page.models.group.create = {}
    $scope.page.models.group.edit = {}
    $scope.page.models.group.remove = {}
    // pad models.
    $scope.page.models.pad = {}
    $scope.page.models.pad.create = {}
    $scope.page.models.pad.edit = {}
    $scope.page.models.pad.remove = {}
    // comment models.
    $scope.page.models.comment = {}
    $scope.page.models.comment.create = {}
    $scope.page.models.comment.edit = {}
    $scope.page.models.comment.remove = {}


    //////////////////////////////////
    // groups start
    //////////////////////////////////

    // getting the users groups
    Firebase.get_user_groups().then(function (outcome) {
        // are there any groups?
        if (outcome.groups) {
            // get the group objects
            $scope.get_groups(outcome)
        }
        else {
            // no groups means the user isnt create as they will
            // always have a default group, so we create that new user.
            Firebase.create_user(outcome)
        }
    })

    $scope.get_groups = function (input) {
        // trigger Firebase function.
        Firebase.get_groups(input.groups)
            .then(function (groups) {
                // assign current user
                $scope.page.data.uid = input.uid
                // assign current users groups
                $scope.page.data.groups = groups
            })
    }

    $scope.remove_group = function (group_id) {
        // build input.
        var input = {
            uid: $scope.page.data.uid,
            group_id: group_id,
        }
        // trigger Firebase function.
        Firebase.remove_group(input).then(function (output) {
            delete $scope.page.data.groups[group_id]
            // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups.length--
            // a check to see if $apply() is already running and if not run it.
            if (!$scope.$$phase) {
                $scope.$apply()
            }
        })
    }

    $scope.update_group = function (group_id) {
        // build input.
        var input = $scope.page.data.groups[group_id]
        input.title = $scope.page.models.group.edit[group_id].title
        // clear page inputs values and UX.
        $scope.page.models.group.edit[group_id].title = "";
        // trigger Firebase function.
        Firebase.update_group(input)
            .then(function (output) {
                group_object = $scope.page.data.groups[output.id]
                group_object.title = output.title
                group_object.timestamp = output.timestamp
                //a check to see if $apply() is already running and if not run it.
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    $scope.create_group = function () {
        // build input.
        var title = $scope.page.models.group.create.title
        var input = {
            title: title,
        }
        // clear page inputs values and UX.
        $scope.page.models.group.create.title = "";
        // trigger Firebase function.
        Firebase.post_group(input)
            .then(function (new_object) {
                group_object = $scope.page.data.groups
                if (!group_object) {
                    group_object = {}
                    group_object.length = 0
                }
                // update the length. (this is important as wont happen automaticaly)
                group_object.length++;
                // create new object with its key as the new id then populate it.
                group_object[new_object.id] = new_object
                $scope.page.data.uid = new_object.created_by
                // tell the new group to allow the current user to access it.
                group_object[new_object.id].users[new_object.created_by] = true
                // a check to see if $apply() is already running and if not run it.
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    //////////////////////////////////
    // groups end
    //////////////////////////////////
    //////////////////////////////////
    // pads start
    //////////////////////////////////
    $scope.remove_pad = function (group_id, pad_id) {
        // build input.
        var input = {
            group_id: group_id,
            pad_id: pad_id,
        }
        // trigger Firebase function.
        Firebase.remove_pad(input).then(function (output) {
            delete $scope.page.data.groups[group_id].pads[pad_id]
            // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups[group_id].pads.length--
            // a check to see if $apply() is already running and if not run it.
            if (!$scope.$$phase) {
                $scope.$apply()
            }
        })
    }
    $scope.create_pad = function (group_id) {
        // get the data from the page inputs.
        var title = $scope.page.models.pad.create[group_id].title
        var body = $scope.page.models.pad.create[group_id].body
        // build input.
        var input = {
            group_id: group_id,
            title: title,
            body: body,
        }
        // clear page inputs values and UX.
        $scope.page.models.pad.create[group_id].title = "";
        $scope.page.models.pad.create[group_id].body = "";
        // trigger Firebase function.
        Firebase.post_pad(input)
            .then(function (new_object) {
                // get current list of pads.
                pads_object = $scope.page.data.groups[group_id].pads
                // if there isnt any pads make a empty pads array and set the length to 0.
                if (!pads_object) {
                    pads_object = {}
                    pads_object.length = 0
                }
                // update the length. (this is important as wont happen automaticaly)
                pads_object.length++;
                // create new object with its key as the new id then populate it.
                pads_object[new_object.id] = {}
                pads_object[new_object.id] = new_object
                // a check to see if $apply() is already running and if not run it.
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    //////////////////////////////////
    // pads end
    //////////////////////////////////
    //////////////////////////////////
    // comments start
    //////////////////////////////////
    $scope.remove_comment = function (group_id, pad_id, comment_id) {
        // build input.
        var input = {
            group_id: group_id,
            pad_id: pad_id,
            comment_id: comment_id,
        }
        // trigger Firebase function.
        Firebase.remove_comment(input).then(function (output) {
            delete $scope.page.data.groups[group_id].pads[pad_id].comments[comment_id]
            // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups[group_id].pads[pad_id].comments.length--
            // a check to see if $apply() is already running and if not run it.
            if (!$scope.$$phase) {
                $scope.$apply()
            }
        })
    }
    $scope.create_comment = function (group_id, pad_id) {
        // build input.
        var body = $scope.page.models.comment.create[pad_id].body
        var input = {
            group_id: group_id,
            pad_id: pad_id,
            body: body,
        }
        // clear page inputs values and UX.
        $scope.page.models.comment.create[pad_id].body = "";
        // trigger Firebase function.
        Firebase.post_comment(input)
            .then(function (new_object) {
                comments_object = $scope.page.data.groups[input.group_id].pads[input.pad_id].comments
                if (!comments_object) {
                    comments_object = {}
                    comments_object.length = 0
                }
                // update the length. (this is important as wont happen automaticaly)
                comments_object.length++;
                // create new object with its key as the new id then populate it.
                comments_object[new_object.id]
                comments_object[new_object.id] = new_object
                // a check to see if $apply() is already running and if not run it.
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    //////////////////////////////////
    // comments end
    //////////////////////////////////
    $scope.flip = function (group_id, pad_key) {
        //create reference to scoped object
        pads_object = $scope.page.data.groups[group_id].pads[pad_key]
        // check that flipped exsists and if it doesnt set it to false
        if (typeof (pads_object.flipped) === "undefeined") {
            pads_object.flipped = false;
        }
        // toggle the flipped between true/false
        pads_object.flipped = !pads_object.flipped
    }
});
//////////////////////////////////
//FlipCtrl end
//////////////////////////////////
