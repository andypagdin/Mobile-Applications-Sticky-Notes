//////////////////////////////////
//HomeCtrl start
//////////////////////////////////

app.controller( 'DashCtrl', function ( $scope, FirebaseServ, AddPadServ ) {
    //////////////////////////////////
    // Accordion Controller Underneath
    //////////////////////////////////
    $scope.page_data = {
        groups: {},
        group_search: null,
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

    $scope.add_new_pad = function ( id ) {
        AddPadServ.setGroupId( id );
        $state.go( 'addPad' );
    };

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
} )

//////////////////////////////////
//HomeCtrl end
//////////////////////////////////
