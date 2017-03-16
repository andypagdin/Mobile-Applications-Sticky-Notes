app.factory( 'Css', ( ) =>
{
    let url = 'css/style';
    return {
        url( )
        {
            return url;
        },
        setUrl( newUrl )
        {
            url = newUrl;
        }
    };
} );
