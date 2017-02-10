//////////////////////////////////
//HomeCtrl start
//////////////////////////////////

app.controller( 'HomeCtrl', function ( $scope, FirebaseServ ) {
    //////////////////////////////////
    // Accordion Controller Underneath
    //////////////////////////////////
    $scope.page_data = {
        groups: {},
        group_search: null,
        group_title: "",
        adding: false,
    };
    // get the users details
    FirebaseServ.get_user( ).then( function ( data = {
        groups: {}
    } ) {
        console.log( "data", data );
        // get the users groups
        if ( !data.groups ) {
            return
        }
        FirebaseServ.get_groups( data.groups )
            .then( function ( groups ) {
                $scope.page_data.groups = groups
            } ).catch( function ( err ) {
                console.error( "[get_groups] we have a error", err )
            } )
    } ).catch( function ( err ) {
        console.error( "[get_user]we have a error", err )
    } );

    $scope.favourite_group = function ( group ) {
        group.star = !group.star;
    };

    $scope.delete_group = function ( group ) {
        var input = {
            uid: $scope.page_data.groups[ group ].created_by,
            group_id: $scope.page_data.groups[ group ].id,
        }
        FirebaseServ.remove_group( input )
        delete $scope.page_data.groups[ group ]
    };

    $scope.order_group = function ( group, fromIndex, toIndex ) {
        $scope.page_data.groups.splice( fromIndex, 1 );
        $scope.page_data.groups.splice( toIndex, 0, group );
    };
    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function ( group ) {
        $scope.shownGroup = ( $scope.isGroupShown( group ) ) ? null : $scope.shownGroup = group;
    };

    $scope.isGroupShown = function ( group ) {
        return $scope.shownGroup === group;
    };
    $scope.active_group_id = 0
    $scope.create_group = function ( group_id ) {
        if ( $scope.update ) {
            var input = $scope.page_data.groups[ $scope.active_group_id ];
            input.title = $scope.page_data.group_title;
            FirebaseServ.update_group( input )
                .then( function ( output ) {
                    console.log( output );
                    if ( !$scope.$$phase ) {
                        $scope.$apply( );
                    }
                } )
            return
        }
        var input = {
            title: $scope.page_data.group_title,
        }
        FirebaseServ.post_group( input )
            .then( function ( new_object ) {
                $scope.page_data.groups[ new_object.id ] = new_object
                if ( !$scope.$$phase ) {
                    $scope.$apply( );
                }
            } )
        $scope.page_data.group_title = "";
        console.info( "post", $scope.page_data.group_title );
    };

    $scope.show_add_group = ( state, mode, group_id ) => {
        $scope.active_group_id = group_id;
        if ( state ) {
            $scope.update = mode;
        }
        if ( mode ) {
            $scope.page_data.group_title = $scope.page_data.groups[ group_id ].title
        }
        console.log( "show_add_group", state )
        $scope.page_data.adding = state
    };
} )

//////////////////////////////////
//HomeCtrl end
//////////////////////////////////
