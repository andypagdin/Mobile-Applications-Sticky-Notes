//////////////////////////////////
//AuthCtrl start
//////////////////////////////////

app.controller( 'AuthCtrl', ( $scope, $rootScope, $state ) =>
{
    $scope.auth = {
        email: "",
        password: "",
        error: false,
        verifed: false,
        signin: false,
        loading: false,
    };
    $scope.google = ( ) =>
    {
        $scope.auth.loading = true;

        const provider = new firebase.auth.GoogleAuthProvider( );

        firebase.auth( ).signInWithRedirect( provider )
            .then( ( ) =>
            {
                $scope.auth.loading = false;
                $scope.$apply( )
            } )
            .catch( error =>
            {
                $scope.auth.error = JSON.stringify( error )
                $scope.auth.loading = false;
                $scope.$apply( )
            } );
    }

    $scope.signout = ( ) =>
    {
        firebase.auth( ).signOut( );
        console.log( "signed out" )
    }

    $scope.signin = ( ) =>
    {
        $scope.auth.loading = true;
        if ( firebase.auth( ).currentUser )
        {
            $scope.signout( );
        }

        const email = $scope.auth.email;
        if ( !email || email.length < 4 )
        {
            $scope.auth.error = 'Please enter an email address.';
            $scope.auth.loading = false;
            return;
        }

        const password = $scope.auth.password;
        if ( !password || password.length < 4 )
        {
            $scope.auth.error = 'Please enter a password.';
            $scope.auth.loading = false;
            return;
        }

        $scope.auth.error = false;
        firebase.auth( ).signInWithEmailAndPassword( email, password )
            .then( ( ) =>
            {
                $scope.auth.loading = false;
                $scope.$apply( )
            } )
            .catch( error =>
            {
                $scope.auth.error = ( error.message ) ? error.message : "Request failed, please try again.";
                $scope.auth.loading = false;
                $scope.$apply( )
            } );
    }

    $scope.signup = ( ) =>
    {
        $scope.auth.loading = true;

        const email = $scope.auth.email;
        if ( !email || email.length < 4 )
        {
            $scope.auth.error = "Please enter an email address.";
            $scope.auth.loading = false;
            return;
        }

        const password = $scope.auth.password;
        if ( !password || password.length < 4 )
        {
            $scope.auth.error = "Please enter a password.";
            $scope.auth.loading = false;
            return;
        }

        firebase.auth( ).createUserWithEmailAndPassword( email, password )
            .then( ( ) =>
            {
                $scope.auth.loading = false;
                $scope.$apply( )
            } )
            .catch( error =>
            {
                $scope.auth.error = error.message;
                $scope.auth.loading = false;
                $scope.$apply( )
            } );
    }

    $scope.reset = ( ) =>
    {
        $scope.auth.loading = true;

        const email = $scope.auth.email;
        if ( !email || email.length < 4 )
        {
            $scope.auth.error = "Please enter an email address.";
            $scope.auth.loading = false;
            return;
        }

        firebase.auth( ).sendPasswordResetEmail( email ).then( ( ) =>
            {
                $scope.auth.error = "Password Reset Email Sent!";
                $scope.auth.loading = false;
                console.log( "we have a res, auth ---", $scope.auth )
                $scope.$apply( )
            } )
            .catch( local_error =>
            {
                console.log( "we have a err, auth ---", $scope.auth )
                switch ( local_error.code )
                {
                    case 'auth/invalid-email':
                        $scope.auth.error = "That email address isn't recognised.";
                        break;
                    case 'auth/user-not-found':
                        $scope.auth.error = "That username isn't recognised.";
                        break;
                    default:
                        $scope.auth.error = local_error.message;
                        break;
                }
                $scope.auth.loading = false;
                $scope.$apply( )
            } );
    }

    $scope.init = ( ) =>
    {
        firebase.auth( ).onAuthStateChanged( user =>
        {
            $scope.auth.loading = false;
            if ( user )
            {
                if ( !$scope.auth.email && !$scope.auth.password )
                {
                    console.log( "there is currently a known user and there shouldnt be", user )
                    $scope.signout( )
                    $scope.$apply( )
                    return
                }
                if ( !user.emailVerified )
                {
                    user.sendEmailVerification( )
                    $scope.auth.error = "Please verify your account.";
                    console.error( $scope.auth.error )
                    $scope.signout( )
                    $scope.$apply( )
                    return
                }
                $state.go( 'tab.home' );
            }
        } )
    }
    $scope.init( );
} )

//////////////////////////////////
//AuthCtrl end
//////////////////////////////////
