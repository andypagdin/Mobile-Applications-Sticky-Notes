app.factory( 'AddPadServ', function ( ) {
    var id;
    return {
        getGroupId: function ( ) {
            return id;
        },
        setGroupId: function ( aid ) {
            id = aid;
        }
    }
} );
