app.controller( 'headCtrl', ( $scope, Css ) =>
{
    $scope.cssOptions = [
    {
        name: 'Default',
        value: 'style'
    },
    {
        name: 'Dark',
        value: 'dark-style'
    },
    {
        name: 'Colour Blind',
        value: 'assisted-style'
    } ];
    $scope.Css = Css;
    $scope.changePath = ( ) =>
    {
        switch ( $scope.css )
        {
            case "style":
                Css.setUrl( 'css/style' );
                break;
            case "assisted-style":
                Css.setUrl( 'css/assisted-style' );
                break;
            default:
                Css.setUrl( 'css/dark-style' );
                break;
        }
    };
} )
