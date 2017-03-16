//////////////////////////////////
//global functions start
//////////////////////////////////


// Initialize Firebase
var config = {
    apiKey: "AIzaSyDXuQU3J2jRIYFf2ZrUfAU3yId5O9EfMzQ",
    authDomain: "mobile-app-uni.firebaseapp.com",
    databaseURL: "https://mobile-app-uni.firebaseio.com",
    storageBucket: "mobile-app-uni.appspot.com",
    messagingSenderId: "968206557542"
};
firebase.initializeApp( config );

syntaxHighlight = function ( json )
{
    // This is a fancy way of doing a stringify
    // It attaches <spans> with classes so you can add colors for each data type
    // heads up it takes a second, regex is HEAVY!
    if ( typeof json != 'string' )
    {
        json = JSON.stringify( json, null, 4 );
    }
    json = json.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
    return json.replace( /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function ( match )
    {
        var cls = 'number';
        if ( /^"/.test( match ) )
        {
            if ( /:$/.test( match ) )
            {
                cls = 'key';
            }
            else
            {
                cls = 'string';
            }
        }
        else if ( /true|false/.test( match ) )
        {
            cls = 'boolean';
        }
        else if ( Number.isInteger( match ) )
        {
            console.log( "WE FOUND AN INT!" )
            cls = 'int';
        }
        else if ( /null/.test( match ) )
        {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    } );
}

pretty = function ( json, heavy )
{
    if ( heavy )
    {
        return syntaxHighlight( json )
    }
    return JSON.stringify( json, null, 4 );
};

//////////////////////////////////
//global functions end
//////////////////////////////////
