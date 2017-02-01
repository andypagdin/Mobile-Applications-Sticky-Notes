//////////////////////////////////
//DashCtrl start
//////////////////////////////////

app.controller( 'DashCtrl', function ( $scope, $state, FirebaseServ ) {

    firebase.auth( ).onAuthStateChanged( function ( user ) {
        if ( user ) {
            $scope.signed_out = false
            $scope.displayName = user.displayName
        } else {
            $state.go( 'login' );
            $scope.signed_out = true
        }
    } );

    $scope.sign_out = function ( ) {
        firebase.auth( ).signOut( ).then( function ( ) {
            console.log( 'Signed Out' );
        }, function ( error ) {
            console.error( 'Sign Out Error', error );
        } );
    }

    //////////////////////////////////
    // Accordion Controller Underneath
    //////////////////////////////////

    $scope.page_data = {}
    $scope.page_data.groups = {}
    $scope.page_data.comment_models = {}
    var group_ids = {}

    FirebaseServ.check_user( ).then( function ( data ) {
        user_details = data
        $scope.get_groups( data )
        console.log( "user_details", user_details )
    } )

    $scope.get_groups = function ( input ) {
        // trigger FirebaseServ function.
        FirebaseServ.get_groups( input.groups )
            .then( function ( groups ) {
                console.info( "input", input )
                console.info( "groups", groups )
                $scope.groups = groups
            } )
    }

    //togglestar
    $scope.toggleStar = function ( group ) {
            group.star = !group.star;
        }
        //delete function
    $scope.onItemDelete = function ( group ) {
            var input = {
                uid: $scope.groups[ group ].created_by,
                group_id: $scope.groups[ group ].id,
            }
            FirebaseServ.remove_group( input )
            delete $scope.groups[ group ]
        }
        //ReOrder function
    $scope.moveItem = function ( group, fromIndex, toIndex ) {
        $scope.groups.splice( fromIndex, 1 );
        $scope.groups.splice( toIndex, 0, group );

    };
    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function ( group ) {
        if ( $scope.isGroupShown( group ) ) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function ( group ) {
        return $scope.shownGroup === group;
    };
} );


//////////////////////////////////
//DashCtrl end
//////////////////////////////////
