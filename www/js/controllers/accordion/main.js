//////////////////////////////////
//AccordionCtrl start
//////////////////////////////////

app.controller( 'AccordionCtrl', function ( $scope, FirebaseServ ) {

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
//AccordionCtrl end
//////////////////////////////////
