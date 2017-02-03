//////////////////////////////////
//AuthCtrl start
//////////////////////////////////

app.controller( 'AuthCtrl', function ( $scope, $state ) {
    $scope.auth = {
        email: "",
        password: "",
        error: false,
        verifed: false,
        signin: false,
        loading: false,
    }
    $scope.google = function ( ) {
        $scope.auth.loading = true;

        var provider = new firebase.auth.GoogleAuthProvider( );

        firebase.auth( ).signInWithRedirect( provider )
            .then( function ( ) {
                $scope.auth.loading = false;
                $scope.$apply( )
            } )
            .catch( function ( error ) {
                $scope.auth.error = JSON.stringify( error )
                $scope.auth.loading = false;
                $scope.$apply( )
            } );

    }

    $scope.signout = function ( ) {
        firebase.auth( ).signOut( );
        console.log( "signed out" )
    }

    $scope.signin = function ( ) {
        $scope.auth.loading = true;

        if ( firebase.auth( ).currentUser ) {
            // if someone logs in then goes back to login they are still logged in, this stops that
            $scope.signout( );
        }

        var email = $scope.auth.email;
        if ( !email || email.length < 4 ) {
            $scope.auth.error = 'Please enter an email address.';
            $scope.auth.loading = false;
            return;
        }

        var password = $scope.auth.password;
        if ( !password || password.length < 4 ) {
            $scope.auth.error = 'Please enter a password.';
            $scope.auth.loading = false;
            return;
        }

        $scope.auth.error = false;
        firebase.auth( ).signInWithEmailAndPassword( email, password )
            .then( function ( ) {
                $scope.auth.loading = false;
                $scope.$apply( )
            } )
            .catch( function ( error ) {
                $scope.auth.error = ( error.message ) ? error.message : "Request failed, please try again.";
                $scope.auth.loading = false;
                $scope.$apply( )
            } );
    }

    $scope.signup = function ( ) {
        $scope.auth.loading = true;

        var email = $scope.auth.email;
        if ( !email || email.length < 4 ) {
            $scope.auth.error = "Please enter an email address.";
            $scope.auth.loading = false;
            return;
        }

        var password = $scope.auth.password;
        if ( !password || password.length < 4 ) {
            $scope.auth.error = "Please enter a password.";
            $scope.auth.loading = false;
            return;
        }

        firebase.auth( ).createUserWithEmailAndPassword( email, password )
            .then( function ( ) {
                $scope.auth.loading = false;
                $scope.$apply( )
            } )
            .catch( function ( error ) {
                $scope.auth.error = error.message;
                $scope.auth.loading = false;
                $scope.$apply( )
            } );
    }

    $scope.reset = function ( ) {
        $scope.auth.loading = true;

        var email = $scope.auth.email;
        if ( !email || email.length < 4 ) {
            $scope.auth.error = "Please enter an email address.";
            $scope.auth.loading = false;
            return;
        }

        firebase.auth( ).sendPasswordResetEmail( email ).then( function ( ) {
                $scope.auth.error = "Password Reset Email Sent!";
                $scope.auth.loading = false;
                console.log( "we have a res, auth ---", $scope.auth )
                $scope.$apply( )
            } )
            .catch( function ( local_error ) {
                console.log( "we have a err, auth ---", $scope.auth )
                switch ( local_error.code ) {
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

    $scope.init = function ( ) {
        firebase.auth( ).onAuthStateChanged( function ( user ) {
            $scope.auth.loading = false;
            if ( user ) {
                if ( !$scope.auth.email && !$scope.auth.password ) {
                    console.log( "there is currently a known user and there shouldnt be", user )
                    $scope.signout( )
                    $scope.$apply( )
                    return
                }
                if ( !user.emailVerified ) {
                    user.sendEmailVerification( )
                    $scope.auth.error = "Please verify your account.";
                    console.error( $scope.auth.error )
                    $scope.signout( )
                    $scope.$apply( )
                    return
                }
                $state.go( 'home' );
            }
        } )
    }
    $scope.init( );
} )

//////////////////////////////////
//AuthCtrl end
//////////////////////////////////
