//////////////////////////////////
//FlipCtrl start
//////////////////////////////////
app.controller( 'FlipCtrl', function ( $scope, FirebaseServ ) {
    //////////////////////////////////
    // Information - JH
    // -------------------------------
    // intro to function structure,
    // All FirebaseServ.functions are asynchronous
    // because of this we use the .then() method
    // which returns once the FirebaseServ function has finished running
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
        // search models.
    $scope.page.models.search = {}
    $scope.page.models.search.displayName = ''
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
    //check the user exsists in the database
    // FirebaseServ.check_user().then(function (output) {
    //     console.log("users", output)
    // })
    // FirebaseServ.get_groups2().then(function (output) {
    //     console.log("users", output)
    //     // assign current user
    //     // $scope.page.data.uid = input.uid
    //     // assign current users groups
    //     $scope.page.data.groups = output
    // })
    console.log( "running" )
        // getting the users groups
    FirebaseServ.check_user( ).then( function ( user_output ) {
        // are there any groups?
        // return
        if ( user_output.groups ) {
            // get the group objects
            console.log( "user_output.groups --- ", user_output.groups )
            $scope.get_groups( user_output )
            console.warn( "data", $scope.page.data )
        } else {
            // no groups means the user isnt create as they will
            // always have a default group, so we create that new user.
            FirebaseServ.create_user( user_output ).then( function ( new_user_output ) {
                post_group( {
                    created_by: user_output.public.uid,
                    title: 'general',
                } ).then( function ( group_output ) {
                    group_object = $scope.page.data.groups
                    group_object.length = 0
                    group_object[ group_output.id ] = group_output
                    $scope.page.data.uid = group_output.created_by
                    group_object[ group_output.id ].users[ group_output.created_by ] = true
                    post_pad( {
                        group_id: group_output.id,
                        created_by: user_output.public.uid,
                        title: 'Your first note!',
                        body: 'This is an example note, flip me over to add a comment!',
                    } ).then( function ( pad_output ) {
                        pads_object = $scope.page.data.groups[ group_output.id ].pads
                        pads_object.length = 0
                        pads_object[ pad_output.id ] = {}
                        pads_object[ pad_output.id ] = pad_output
                        if ( !$scope.$$phase ) {
                            $scope.$apply( )
                        }
                        console.warn( "data", $scope.page.data )
                    } )
                } )
            } )
        }
    } )

    $scope.get_groups = function ( input ) {
        // trigger FirebaseServ function.
        FirebaseServ.get_groups( input.groups )
            .then( function ( groups ) {
                console.info( "input", input )
                console.info( "groups", groups )
                    // assign current user
                $scope.page.data.uid = input.public.uid
                    // assign current users groups
                $scope.page.data.groups = groups
            } )
    }

    $scope.remove_group = function ( group_id ) {
        // build input.
        var input = {
                uid: $scope.page.data.uid,
                group_id: group_id,
            }
            // trigger FirebaseServ function.
        FirebaseServ.remove_group( input ).then( function ( output ) {
            delete $scope.page.data.groups[ group_id ]
                // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups.length--
                // a check to see if $apply() is already running and if not run it.
                if ( !$scope.$$phase ) {
                    $scope.$apply( )
                }
        } )
    }

    $scope.update_group = function ( group_id ) {
        group = $scope.page.models.group.edit[ group_id ]
        if ( !group ) {
            return
        }
        // build input.
        var input = $scope.page.data.groups[ group_id ]
        input.title = group.title;
        // clear page inputs values and UX.
        $scope.page.models.group.edit[ group_id ].title = "";
        // trigger FirebaseServ function.
        FirebaseServ.update_group( input )
            .then( function ( output ) {
                group_object = $scope.page.data.groups[ output.id ]
                group_object.title = output.title
                group_object.timestamp = output.timestamp
                    //a check to see if $apply() is already running and if not run it.
                if ( !$scope.$$phase ) {
                    $scope.$apply( )
                }
            } )
    }
    $scope.create_group = function ( ) {
            // build input.
            var title = $scope.page.models.group.create.title
            if ( !title ) {
                return
            }
            var input = {
                    title: title,
                }
                // clear page inputs values and UX.
            $scope.page.models.group.create.title = "";
            // trigger FirebaseServ function.
            FirebaseServ.post_group( input )
                .then( function ( new_object ) {
                    group_object = $scope.page.data.groups
                    if ( !group_object ) {
                        group_object = {}
                        group_object.length = 0
                    }
                    // update the length. (this is important as wont happen automaticaly)
                    group_object.length++;
                    // create new object with its key as the new id then populate it.
                    group_object[ new_object.id ] = new_object
                    $scope.page.data.uid = new_object.created_by
                        // tell the new group to allow the current user to access it.
                    group_object[ new_object.id ].users[ new_object.created_by ] = true
                        // a check to see if $apply() is already running and if not run it.
                    if ( !$scope.$$phase ) {
                        $scope.$apply( )
                    }
                } )
        }
        //////////////////////////////////
        // groups end
        //////////////////////////////////
        //////////////////////////////////
        // pads start
        //////////////////////////////////
    $scope.remove_pad = function ( group_id, pad_id ) {
        // build input.
        var input = {
                group_id: group_id,
                pad_id: pad_id,
            }
            // trigger FirebaseServ function.
        FirebaseServ.remove_pad( input ).then( function ( output ) {
            delete $scope.page.data.groups[ group_id ].pads[ pad_id ]
                // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups[ group_id ].pads.length--
                // a check to see if $apply() is already running and if not run it.
                if ( !$scope.$$phase ) {
                    $scope.$apply( )
                }
        } )
    }
    $scope.create_pad = function ( group_id ) {
            // get the data from the page inputs.
            var title = $scope.page.models.pad.create[ group_id ].title
            var body = $scope.page.models.pad.create[ group_id ].body
                // build input.
            var input = {
                    group_id: group_id,
                    title: title,
                    body: body,
                }
                // clear page inputs values and UX.
            $scope.page.models.pad.create[ group_id ].title = "";
            $scope.page.models.pad.create[ group_id ].body = "";
            // trigger FirebaseServ function.
            FirebaseServ.post_pad( input )
                .then( function ( new_object ) {
                    // get current list of pads.
                    pads_object = $scope.page.data.groups[ group_id ].pads
                        // if there isnt any pads make a empty pads array and set the length to 0.
                    if ( !pads_object ) {
                        pads_object = {}
                        pads_object.length = 0
                    }
                    // update the length. (this is important as wont happen automaticaly)
                    pads_object.length++;
                    // create new object with its key as the new id then populate it.
                    pads_object[ new_object.id ] = {}
                    pads_object[ new_object.id ] = new_object
                        // a check to see if $apply() is already running and if not run it.
                    if ( !$scope.$$phase ) {
                        $scope.$apply( )
                    }
                } )
        }
        //////////////////////////////////
        // pads end
        //////////////////////////////////
        //////////////////////////////////
        // comments start
        //////////////////////////////////
    $scope.remove_comment = function ( group_id, pad_id, comment_id ) {
        // build input.
        var input = {
                group_id: group_id,
                pad_id: pad_id,
                comment_id: comment_id,
            }
            // trigger FirebaseServ function.
        FirebaseServ.remove_comment( input ).then( function ( output ) {
            delete $scope.page.data.groups[ group_id ].pads[ pad_id ].comments[ comment_id ]
                // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups[ group_id ].pads[ pad_id ].comments.length--
                // a check to see if $apply() is already running and if not run it.
                if ( !$scope.$$phase ) {
                    $scope.$apply( )
                }
        } )
    }
    $scope.create_comment = function ( group_id, pad_id ) {
            // build input.
            var body = $scope.page.models.comment.create[ pad_id ].body
            var input = {
                group_id: group_id,
                pad_id: pad_id,
                body: body,
            }
            console.info( input )
                // clear page inputs values and UX.
            $scope.page.models.comment.create[ pad_id ].body = "";
            // trigger FirebaseServ function.
            FirebaseServ.post_comment( input )
                .then( function ( new_object ) {
                    console.info( "new_object", new_object )
                    console.info( "$scope.page.data", $scope.page.data )
                    current_pad = $scope.page.data.groups[ input.group_id ].pads[ input.pad_id ]
                    comments_object = current_pad.comments
                    if ( !comments_object ) {
                        current_pad.comments = {}
                        comments_object = current_pad.comments
                        comments_object.length = 0
                        comments_object.lengthe = "testing"

                    }
                    console.log( "new pad obj", current_pad )
                    console.log( "new comment obj", comments_object )
                        // update the length. (this is important as wont happen automaticaly)
                    comments_object.length++;
                    // create new object with its key as the new id then populate it.
                    comments_object[ new_object.id ]
                    comments_object[ new_object.id ] = new_object
                        // a check to see if $apply() is already running and if not run it.
                    console.info( "$scope.page.data", $scope.page.data )
                    if ( !$scope.$$phase ) {
                        $scope.$apply( )
                    }
                } )
        }
        //////////////////////////////////
        // comments end
        //////////////////////////////////
    $scope.search_contact = function ( ) {
        if ( !$scope.page.models.search.displayName ) {
            return
        }
        input = {
            search: $scope.page.models.search.displayName,
        }
        FirebaseServ.search_contacts( input ).then( function ( output ) {
            console.log( output )
        } )
    }

    $scope.flip = function ( group_id, pad_key ) {
        //create reference to scoped object
        pads_object = $scope.page.data.groups[ group_id ].pads[ pad_key ]
            // check that flipped exsists and if it doesnt set it to false
        if ( typeof ( pads_object.flipped ) === "undefeined" ) {
            pads_object.flipped = false;
        }
        // toggle the flipped between true/false
        pads_object.flipped = !pads_object.flipped
    }
} );
//////////////////////////////////
//FlipCtrl end
//////////////////////////////////
