//////////////////////////////////
//HomeCtrl start
//////////////////////////////////

app.controller( 'HomeCtrl', ( $scope, FirebaseServ, $timeout, $rootScope ) =>
{
    //////////////////////////////////
    // Accordion Controller Underneath
    //////////////////////////////////
    $scope.page_data = {
        groups:
        {},
        group_search: null,
        group_title: "",
        group_animation:
        {},
        adding: false,
        note:
        {
            active: false,
            group_id: "",
            group_title: "",
            title: "",
            priority_time: "",
            body: "",
        },
        buffer: true,
        list: true,
    };

    // get the users details
    FirebaseServ.get_user( ).then( (
        data = {
            groups:
            {}
        }
    ) =>
    {
        console.log( "data", data );
        // get the users groups
        if ( !data.groups )
        {
            return
        }
        FirebaseServ.get_groups( data.groups )
            .then( groups =>
            {
                $scope.page_data.groups = groups
            } ).catch( err =>
            {
                console.error( "[get_groups] we have a error", err )
            } )
    } ).catch( err =>
    {
        console.error( "[get_user]we have a error", err )
    } );

    $scope.favourite_group = group =>
    {
        group.favourite = !group.favourite;
    };

    $scope.delete_group = group =>
    {
        const input = {
            uid: $scope.page_data.groups[ group ].created_by,
            group_id: $scope.page_data.groups[ group ].id,
        };
        FirebaseServ.remove_group( input )
        delete $scope.page_data.groups[ group ]
    };

    $scope.order_group = ( group, fromIndex, toIndex ) =>
    {
        $scope.page_data.groups.splice( fromIndex, 1 );
        $scope.page_data.groups.splice( toIndex, 0, group );
    };
    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = group =>
    {
        console.log( "group", group )
        $scope.shownGroup = ( $scope.isGroupShown( group ) ) ? null : group;
    };

    $scope.isGroupShown = group => $scope.shownGroup === group;

    $scope.show_saveGroup = ( show = false, group_id = false ) =>
    {
        $scope.page_data.group_title = ( group_id ) ? $scope.page_data.groups[ group_id ].title : "";
        $scope.active_group_id = group_id;
        $scope.page_data.adding = show;
    };
    $scope.active_group_id = 0
    $scope.saveGroup = ( ) =>
    {
        const input = ( $scope.active_group_id ) ? $scope.page_data.groups[ $scope.active_group_id ] :
        {};
        input[ "title" ] = $scope.page_data.group_title;
        FirebaseServ.post_group( input )
            .then( output =>
            {
                $scope.page_data.groups[ output.id ] = output
                if ( !$scope.$$phase )
                {
                    $scope.$apply( );
                }
            } )
    };

    $scope.prepPad = ( group_id = false, pad_id = false ) =>
    {
        if ( !group_id ) return;
        const cur_group = $scope.page_data.groups[ group_id ];
        if ( pad_id )
        {
            const cur_note = cur_group.pads[ pad_id ];
            $scope.page_data.note.group_id = group_id || "";
            $scope.page_data.note.group_title = cur_group.title || "";
            $scope.page_data.note.pad_id = pad_id || "";
            $scope.page_data.note.title = cur_note.title || "";
            $scope.page_data.note.priority_time = cur_note.priority_time || "";
            $scope.page_data.note.body = cur_note.body || "";
            $scope.page_data.note.mode = "update";
        }
        else
        {
            $scope.page_data.note.group_id = group_id || "";
            $scope.page_data.note.group_title = cur_group.title || "";
            $scope.page_data.note.title = "";
            $scope.page_data.note.priority_time = "";
            $scope.page_data.note.body = "";
            $scope.page_data.note.mode = "create";
        }
        $scope.toggle_page( "note", cur_group );
        if ( !$scope.$$phase )
        {
            $scope.$apply( );
        }
    };
    $scope.toggle_page = ( mode = false, current_group = false ) =>
    {
        switch ( mode )
        {
            case "note":
                $scope.page_data.list = !$scope.page_data.list;
                $timeout( ( ) =>
                {
                    $scope.page_data.buffer = !$scope.page_data.buffer;
                }, 100 );
                $timeout( ( ) =>
                {
                    $scope.page_data.note.active = !$scope.page_data.note.active;
                    if ( current_group )
                    {
                        $scope.toggleGroup( current_group );
                    }
                }, 200 );
                break;
            case "list":
                $scope.page_data.note.active = !$scope.page_data.note.active;
                $timeout( ( ) =>
                {
                    $scope.page_data.buffer = !$scope.page_data.buffer;
                }, 100 );
                $timeout( ( ) =>
                {
                    $scope.page_data.list = !$scope.page_data.list;
                }, 200 );
                break;
            case false:
            default:
                console.log( "unknown mode - ", mode );
                break;

        }
        if ( !$scope.$$phase )
        {
            $scope.$apply( );
        }
    };
    $scope.savePad = ( ) =>
    {
        // build input.
        const group_id = $scope.page_data.note.group_id;
        const input = {
            group_id,
            title: $scope.page_data.note.title,
            priority_time: $scope.page_data.note.priority_time,
            body: $scope.page_data.note.body,
        };
        // if you pass pad_id to input[id] it will updated that pad 
        input[ "id" ] = ( $scope.page_data.note.pad_id ) ? $scope.page_data.note.pad_id : false;
        // trigger FirebaseServ function.
        FirebaseServ.post_pad( input )
            .then( output =>
            {
                // get current list of pads.
                $scope.page_data.groups[ group_id ].pads = ( $scope.page_data.groups[ group_id ].pads ) ? $scope.page_data.groups[ group_id ].pads :
                {};
                // create new object with its key as the new id then populate it.
                $scope.page_data.groups[ group_id ].pads[ output.id ] = {};
                $scope.page_data.groups[ group_id ].pads[ output.id ] = output;
                // a check to see if $apply() is already running and if not run it.
                if ( !$scope.$$phase )
                {
                    $scope.$apply( );
                }
            } )
    }

} )

//////////////////////////////////
//HomeCtrl end
//////////////////////////////////
