//////////////////////////////////
// !!!WARNING!!! - JH
// -------------------------------
// If you are editing this in the controllers.js file don't! 
// Becuase as soon as the gulp process runs you work will be over written!!!
// Please edit the indavidual files in /www/js/controllers/..
//////////////////////////////////


//////////////////////////////////
//base start
//////////////////////////////////


//////////////////////////////////
// Information - JH
// -------------------------------
// I add app = to the angular.modules( 'bla', [ 'bla', 'bla', 'bla'])
// Becuase if anything that doesnt start with .whatever will break the app
// But! By assigning it to a var it always knows what its base module is!
//////////////////////////////////
app = angular.module( 'starter.controllers', [ ] )
	//inject indavidual controllers here!

//////////////////////////////////
//base end
//////////////////////////////////


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

//////////////////////////////////
//AccountCtrl start
//////////////////////////////////

app.controller( 'AccountCtrl', function ( $scope, $state )
{
	firebase.auth( ).onAuthStateChanged( function ( user )
	{
		if ( user )
		{
			$scope.email = user.email
			$scope.uid = user.uid
			$scope.displayName = user.displayName
			$scope.photoURL = user.photoURL

			var isVerified = user.emailVerified

			if ( user.emailVerified )
			{
				$scope.isVerified = "You have verified your account";
			}
			else
			{
				$scope.isVerified = "You have not verified your account";
				btnVerifyEmail.classList.remove('hide');
			}
		}
		else
		{

		}
	} );

	$scope.signOut = function ( )
	{
		firebase.auth( ).signOut( ).then( function ( )
		{
			$state.go( 'login' )
			console.log( "signed out" )
		}, function ( error )
		{
			console.log( error )
		} );
	}

	$scope.settings = {
		enableFriends: true
	};

	/**
	 * Sends an email verification to the user.
	 */
	$scope.sendEmailVerification = function ( )
	{
		// [START sendemailverification]
		firebase.auth( ).currentUser.sendEmailVerification( ).then( function ( )
		{
			// Email Verification sent!
			// [START_EXCLUDE]
			console.info( 'Email Verification Sent!' );
			// [END_EXCLUDE]
		} );
		// [END sendemailverification]
	}
} );

//////////////////////////////////
//AccountCtrl end
//////////////////////////////////


app.controller( 'addPadCtrl', function ( $scope, FirebaseServ ) {
    $scope.page_data = {}
    $scope.page_data.groups = {}
    $scope.page_data.group_models = {}
    $scope.page_data.pad_models = {}
    $scope.page_data.pad_models[ "-KXNSUDZByXtgP6KaCQe" ] = {}
    $scope.page_data.comment_models = {}
    $scope.page_data.currentGroup = {
        id: "-KXNSUDZByXtgP6KaCQe",
        title: "",
        body: "",
    }
    var group_ids = {}

    $scope.create_pad = function ( ) {
        var title = $scope.page_data.currentGroup.title
        var body = $scope.page_data.currentGroup.body
        var input = {
            group_id: $scope.page_data.currentGroup.id,
            title: title,
            body: body,
        }
        $scope.page_data.currentGroup.title = "";
        $scope.page_data.currentGroup.body = "";
        FirebaseServ.post_pad( input )
            .then( function ( new_object ) {
                pads_object = $scope.page_data.groups[ group_id ].pads
                if ( !pads_object ) {
                    pads_object = {}
                    pads_object.length = 0
                }
                pads_object[ new_object.id ] = {}
                pads_object[ new_object.id ] = new_object
                pads_object.length++
                    console.log( "pads_object", pads_object )
                if ( !$scope.$$phase ) {
                    $scope.$apply( )
                }
            } )
    }


} );

//////////////////////////////////
//EditPadCtrl start
//////////////////////////////////

app.controller( 'EditPadCtrl', function ( $scope, $state, FirebaseServ, $stateParams ) {
    // Put state parameters into the scope
    $scope.pad_id = $stateParams.pad_id
    $scope.title = $stateParams.title
    $scope.body = $stateParams.body
    $scope.group_id = $stateParams.group_id
    $scope.created_by = $stateParams.created_by
    $scope.timestamp = $stateParams.timestamp

    $scope.goBack = function ( ) {
        $state.go( "tab.dash" )
    }


    $scope.updateNote = function ( $body ) {
        firebase.database( ).ref( 'groups/' + $scope.group_id + '/pads/' + $scope.pad_id ).set( {
            body: $body,
            created_by: $scope.created_by,
            id: $scope.pad_id,
            timestamp: $scope.timestamp,
            title: $scope.title
        } )
    }

} );

//////////////////////////////////
//EditPadCtrl end
//////////////////////////////////

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
    };
    // get the users details
    FirebaseServ.get_user( ).then( function ( data ) {
        $scope.page_data.displayName = data.public.displayName;
        // get the users groups
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
} )

//////////////////////////////////
//HomeCtrl end
//////////////////////////////////

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

app.controller( 'NavCtrl', function ( $scope, $location )
{
	$scope.go = function ( path ) {
    $location.path( path );
  };
} );
//////////////////////////////////
//LoginCtrl start
//////////////////////////////////

app.controller( 'LoginCtrl', function ( $scope, $state ) {
    //////////////////////////////////
    // !!!IMPORTANT!!! - JH
    // -------------------------------
    // stupid angular scoping issues means that the ion-content 
    // container makes a clone of the $scope meaning you need to decalre vars ahead of
    // using them in the view otherwise the js wont know what you are refferencing
    //////////////////////////////////
    $scope.auth = {
        email: "",
        password: ""
    }
    $scope.error_output = {
        user: "",
        admin: ""
    }
    $scope.user_data = {
        displayName: "",
        email: "",
        emailVerified: "",
        photoURL: "",
        isAnonymous: "",
        uid: "",
        providerData: ""
    }
    $scope.input = {
        displayName: ""
    }

    $scope.googleSignIn = function ( ) {
        alert( "googleSignIn" );
        var provider = new firebase.auth.GoogleAuthProvider( );
        alert( "past provider" );

        firebase.auth( ).signInWithRedirect( provider ).then( function ( ) {
            alert( "all seems fine!?" );
        } ).catch( function ( error ) {
            alert( JSON.stringify( error ) );
        } );
    }


    /**
     * Handles the sign in button press.
     */
    $scope.toggleSignIn = function ( ) {
        if ( firebase.auth( ).currentUser ) {
            // [START signout]
            firebase.auth( ).signOut( );
            // [END signout]
        } else {
            var email = $scope.auth.email;
            var password = $scope.auth.password;
            if ( !email || email.length < 4 ) {
                $scope.error_output.user = 'Please enter an email address.';
                return;
            }
            if ( !password || password.length < 4 ) {
                $scope.error_output.user = 'Please enter a password.';
                return;
            }
            // Sign in with email and pass.
            // [START authwithemail]
            firebase.auth( ).signInWithEmailAndPassword( email, password ).catch( function ( error ) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if ( errorCode === 'auth/wrong-password' ) {
                    $scope.error_output.user = "Wrong password."
                } else {
                    $scope.error_output.admin = "Wrong password."
                    console.error( errorMessage );
                    alert( JSON.stringify( errorMessage ) );
                }
                console.log( error );

                $scope.signinable = false
                    // document.getElementById( 'quickstart-sign-in' ).disabled = false;
                    // [END_EXCLUDE]
            } );
            // [END authwithemail]
        }
        $scope.signinable = true
            // document.getElementById( 'quickstart-sign-in' ).disabled = true;
    }

    /**
     * Handles the sign up button press.
     */
    $scope.handleSignUp = function ( ) {
        var email = $scope.auth.email;
        var password = $scope.auth.password;
        if ( email.length < 4 ) {
            console.info( 'Please enter an email address.' );
            return;
        }
        if ( password.length < 4 ) {
            console.info( 'Please enter a password.' );
            return;
        }
        // Sign in with email and pass.
        // [START createwithemail]
        firebase.auth( ).createUserWithEmailAndPassword( email, password ).catch( function ( error ) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if ( errorCode == 'auth/weak-password' ) {
                console.error( 'The password is too weak.' );
            } else {
                console.error( errorMessage );
                alert( JSON.stringify( errorMessage ) );
            }
            console.log( error );
            // [END_EXCLUDE]
        } );
        // [END createwithemail]
    }

    $scope.sendPasswordReset = function ( ) {
            var email = $scope.auth.email;
            // var email = document.getElementById( 'email' ).value;
            // [START sendpasswordemail]
            firebase.auth( ).sendPasswordResetEmail( email ).then( function ( ) {
                // Password Reset Email Sent!
                // [START_EXCLUDE]
                console.info( 'Password Reset Email Sent!' );
                // [END_EXCLUDE]
            } ).catch( function ( error ) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if ( errorCode == 'auth/invalid-email' ) {
                    console.error( errorMessage );
                    alert( JSON.stringify( errorMessage ) );
                } else if ( errorCode == 'auth/user-not-found' ) {
                    console.error( errorMessage );
                    alert( JSON.stringify( errorMessage ) );
                }
                console.log( error );
                // [END_EXCLUDE]
            } );
            // [END sendpasswordemail];
        }
        // firebase.auth( ).onAuthStateChanged( function ( user )
        // 	{
        // 		console.log( "AUTH CHANGE", user )
        // 	} )


    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    $scope.initApp = function ( ) {
        // Listening for auth state changes.[START authstatelistener]
        firebase.auth( ).onAuthStateChanged( function ( user ) {
            console.log( "AUTH CHANGE", user )
                // [START_EXCLUDE silent]
                // document.getElementById('quickstart-verify-email').disabled = true;
            $scope.verifyable = true
                // [END_EXCLUDE]
            if ( user ) {
                // User is signed in.
                $scope.signed_in = true;
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;
                $scope.user_data.displayName = displayName
                $scope.user_data.email = email
                $scope.user_data.emailVerified = emailVerified
                $scope.user_data.photoURL = photoURL
                $scope.user_data.isAnonymous = isAnonymous
                $scope.user_data.uid = uid
                $scope.user_data.providerData = providerData
                    // [START_EXCLUDE silent]
                $scope.login_status = 'Signed in'
                $scope.sign_status_text = 'Sign out'
                $scope.quick_start_acc_details = pretty( user )

                // If the user does not have a display name set (first time visiting)
                // Point them to set one, else go home 
                if ( displayName ) {
                    $state.go( 'tab.dash' );
                    console.log( "display name set " + displayName )
                } else {
                    // $state.go( 'name' );
                    console.log( "display name not set" )
                }

                console.log( "view should have changed with this data - ", $scope.user_data )

                // document.getElementById( 'quickstart-sign-in-status' ).textContent = 'Signed in';
                // document.getElementById( 'quickstart-sign-in' ).textContent = 'Sign out';
                // document.getElementById( 'quickstart-account-details' ).textContent = JSON.stringify( user, null, '  ' );
                if ( !emailVerified ) {

                    $scope.verifyable = false
                        // document.getElementById( 'quickstart-verify-email' ).disabled = false;
                }
                // [END_EXCLUDE]
            } else {
                // User is signed out.
                // [START_EXCLUDE silent]
                $scope.user_data.displayName = ""
                $scope.user_data.email = ""
                $scope.user_data.emailVerified = ""
                $scope.user_data.photoURL = ""
                $scope.user_data.isAnonymous = ""
                $scope.user_data.uid = ""
                $scope.user_data.providerData = ""
                $scope.signed_in = false;
                $scope.login_status = 'Signed out'
                $scope.sign_status_text = 'Sign in'
                $scope.quick_start_acc_details = 'null'
                console.log( "view should have changed with this data - ", $scope.user_data )
                    // document.getElementById( 'quickstart-sign-in-status' ).textContent = 'Signed out';
                    // document.getElementById( 'quickstart-sign-in' ).textContent = 'Sign in';
                    // document.getElementById( 'quickstart-account-details' ).textContent = 'null';
                    // [END_EXCLUDE]
            }
            // [START_EXCLUDE silent]
            // document.getElementById( 'quickstart-sign-in' ).disabled = false;
            $scope.signinable = false
                // [END_EXCLUDE]
            $scope.$apply( )
        } );
        // [END authstatelistener]

        // document.getElementById( 'quickstart-sign-in' ).addEventListener( 'click', toggleSignIn, false );
        // document.getElementById( 'quickstart-sign-up' ).addEventListener( 'click', handleSignUp, false );
        // document.getElementById( 'quickstart-verify-email' ).addEventListener( 'click', sendEmailVerification, false );
        // document.getElementById( 'quickstart-password-reset' ).addEventListener( 'click', sendPasswordReset, false );
    }

    $scope.updateDisplayName = function ( ) {

        var user = firebase.auth( ).currentUser;

        var displayName = $scope.input.displayName

        user.updateProfile( {
            displayName: displayName
        } ).then( function ( ) {
            $state.go( 'tab.dash' )
            console.log( "update success " + displayName )
        }, function ( error ) {
            console.log( error )
        } );
    };

    // window.onload = function ( )
    // {
    $scope.initApp( );
    // };


} )

//////////////////////////////////
//LoginCtrl end
//////////////////////////////////

//////////////////////////////////
//FlipCtrl start
//////////////////////////////////
app.controller( 'FlipCtrl', function ( $scope, FirebaseServ ) {
    //////////////////////////////////
    // Information - JH
    // -------------------------------
    // intro to function structure,
    // All FirebaseServ.functions are asynchronous
    // because of this we use the .then() method
    // which returns once the FirebaseServ function has finished running
    //////////////////////////////////

    // data related to the view is in $scope.page.data
    $scope.page = {}
        //core data for the page.
    $scope.page.data = {}
        // groups > pads > comments data for the page.
    $scope.page.data.groups = {}
        // current user id for the page.
    $scope.page.data.uid = ""
        // the values for tha page.
    $scope.page.models = {}
        // search models.
    $scope.page.models.search = {}
    $scope.page.models.search.displayName = ''
        // group models.
    $scope.page.models.group = {}
    $scope.page.models.group.create = {}
    $scope.page.models.group.edit = {}
    $scope.page.models.group.remove = {}
        // pad models.
    $scope.page.models.pad = {}
    $scope.page.models.pad.create = {}
    $scope.page.models.pad.edit = {}
    $scope.page.models.pad.remove = {}
        // comment models.
    $scope.page.models.comment = {}
    $scope.page.models.comment.create = {}
    $scope.page.models.comment.edit = {}
    $scope.page.models.comment.remove = {}


    //////////////////////////////////
    // groups start
    //////////////////////////////////
    //check the user exsists in the database
    // FirebaseServ.check_user().then(function (output) {
    //     console.log("users", output)
    // })
    // FirebaseServ.get_groups2().then(function (output) {
    //     console.log("users", output)
    //     // assign current user
    //     // $scope.page.data.uid = input.uid
    //     // assign current users groups
    //     $scope.page.data.groups = output
    // })
    console.log( "running" )
        // getting the users groups
    FirebaseServ.check_user( ).then( function ( user_output ) {
        // are there any groups?
        // return
        if ( user_output.groups ) {
            // get the group objects
            console.log( "user_output.groups --- ", user_output.groups )
            $scope.get_groups( user_output )
            console.warn( "data", $scope.page.data )
        } else {
            // no groups means the user isnt create as they will
            // always have a default group, so we create that new user.
            FirebaseServ.create_user( user_output ).then( function ( new_user_output ) {
                post_group( {
                    created_by: user_output.public.uid,
                    title: 'general',
                } ).then( function ( group_output ) {
                    group_object = $scope.page.data.groups
                    group_object.length = 0
                    group_object[ group_output.id ] = group_output
                    $scope.page.data.uid = group_output.created_by
                    group_object[ group_output.id ].users[ group_output.created_by ] = true
                    post_pad( {
                        group_id: group_output.id,
                        created_by: user_output.public.uid,
                        title: 'Your first note!',
                        body: 'This is an example note, flip me over to add a comment!',
                    } ).then( function ( pad_output ) {
                        pads_object = $scope.page.data.groups[ group_output.id ].pads
                        pads_object.length = 0
                        pads_object[ pad_output.id ] = {}
                        pads_object[ pad_output.id ] = pad_output
                        if ( !$scope.$$phase ) {
                            $scope.$apply( )
                        }
                        console.warn( "data", $scope.page.data )
                    } )
                } )
            } )
        }
    } )

    $scope.get_groups = function ( input ) {
        // trigger FirebaseServ function.
        FirebaseServ.get_groups( input.groups )
            .then( function ( groups ) {
                console.info( "input", input )
                console.info( "groups", groups )
                    // assign current user
                $scope.page.data.uid = input.public.uid
                    // assign current users groups
                $scope.page.data.groups = groups
            } )
    }

    $scope.remove_group = function ( group_id ) {
        // build input.
        var input = {
                uid: $scope.page.data.uid,
                group_id: group_id,
            }
            // trigger FirebaseServ function.
        FirebaseServ.remove_group( input ).then( function ( output ) {
            delete $scope.page.data.groups[ group_id ]
                // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups.length--
                // a check to see if $apply() is already running and if not run it.
                if ( !$scope.$$phase ) {
                    $scope.$apply( )
                }
        } )
    }

    $scope.update_group = function ( group_id ) {
        group = $scope.page.models.group.edit[ group_id ]
        if ( !group ) {
            return
        }
        // build input.
        var input = $scope.page.data.groups[ group_id ]
        input.title = group.title
            // clear page inputs values and UX.
        $scope.page.models.group.edit[ group_id ].title = "";
        // trigger FirebaseServ function.
        FirebaseServ.update_group( input )
            .then( function ( output ) {
                group_object = $scope.page.data.groups[ output.id ]
                group_object.title = output.title
                group_object.timestamp = output.timestamp
                    //a check to see if $apply() is already running and if not run it.
                if ( !$scope.$$phase ) {
                    $scope.$apply( )
                }
            } )
    }
    $scope.create_group = function ( ) {
            // build input.
            var title = $scope.page.models.group.create.title
            if ( !title ) {
                return
            }
            var input = {
                    title: title,
                }
                // clear page inputs values and UX.
            $scope.page.models.group.create.title = "";
            // trigger FirebaseServ function.
            FirebaseServ.post_group( input )
                .then( function ( new_object ) {
                    group_object = $scope.page.data.groups
                    if ( !group_object ) {
                        group_object = {}
                        group_object.length = 0
                    }
                    // update the length. (this is important as wont happen automaticaly)
                    group_object.length++;
                    // create new object with its key as the new id then populate it.
                    group_object[ new_object.id ] = new_object
                    $scope.page.data.uid = new_object.created_by
                        // tell the new group to allow the current user to access it.
                    group_object[ new_object.id ].users[ new_object.created_by ] = true
                        // a check to see if $apply() is already running and if not run it.
                    if ( !$scope.$$phase ) {
                        $scope.$apply( )
                    }
                } )
        }
        //////////////////////////////////
        // groups end
        //////////////////////////////////
        //////////////////////////////////
        // pads start
        //////////////////////////////////
    $scope.remove_pad = function ( group_id, pad_id ) {
        // build input.
        var input = {
                group_id: group_id,
                pad_id: pad_id,
            }
            // trigger FirebaseServ function.
        FirebaseServ.remove_pad( input ).then( function ( output ) {
            delete $scope.page.data.groups[ group_id ].pads[ pad_id ]
                // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups[ group_id ].pads.length--
                // a check to see if $apply() is already running and if not run it.
                if ( !$scope.$$phase ) {
                    $scope.$apply( )
                }
        } )
    }
    $scope.create_pad = function ( group_id ) {
            // get the data from the page inputs.
            var title = $scope.page.models.pad.create[ group_id ].title
            var body = $scope.page.models.pad.create[ group_id ].body
                // build input.
            var input = {
                    group_id: group_id,
                    title: title,
                    body: body,
                }
                // clear page inputs values and UX.
            $scope.page.models.pad.create[ group_id ].title = "";
            $scope.page.models.pad.create[ group_id ].body = "";
            // trigger FirebaseServ function.
            FirebaseServ.post_pad( input )
                .then( function ( new_object ) {
                    // get current list of pads.
                    pads_object = $scope.page.data.groups[ group_id ].pads
                        // if there isnt any pads make a empty pads array and set the length to 0.
                    if ( !pads_object ) {
                        pads_object = {}
                        pads_object.length = 0
                    }
                    // update the length. (this is important as wont happen automaticaly)
                    pads_object.length++;
                    // create new object with its key as the new id then populate it.
                    pads_object[ new_object.id ] = {}
                    pads_object[ new_object.id ] = new_object
                        // a check to see if $apply() is already running and if not run it.
                    if ( !$scope.$$phase ) {
                        $scope.$apply( )
                    }
                } )
        }
        //////////////////////////////////
        // pads end
        //////////////////////////////////
        //////////////////////////////////
        // comments start
        //////////////////////////////////
    $scope.remove_comment = function ( group_id, pad_id, comment_id ) {
        // build input.
        var input = {
                group_id: group_id,
                pad_id: pad_id,
                comment_id: comment_id,
            }
            // trigger FirebaseServ function.
        FirebaseServ.remove_comment( input ).then( function ( output ) {
            delete $scope.page.data.groups[ group_id ].pads[ pad_id ].comments[ comment_id ]
                // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups[ group_id ].pads[ pad_id ].comments.length--
                // a check to see if $apply() is already running and if not run it.
                if ( !$scope.$$phase ) {
                    $scope.$apply( )
                }
        } )
    }
    $scope.create_comment = function ( group_id, pad_id ) {
            // build input.
            var body = $scope.page.models.comment.create[ pad_id ].body
            var input = {
                group_id: group_id,
                pad_id: pad_id,
                body: body,
            }
            console.info( input )
                // clear page inputs values and UX.
            $scope.page.models.comment.create[ pad_id ].body = "";
            // trigger FirebaseServ function.
            FirebaseServ.post_comment( input )
                .then( function ( new_object ) {
                    console.info( "new_object", new_object )
                    console.info( "$scope.page.data", $scope.page.data )
                    current_pad = $scope.page.data.groups[ input.group_id ].pads[ input.pad_id ]
                    comments_object = current_pad.comments
                    if ( !comments_object ) {
                        current_pad.comments = {}
                        comments_object = current_pad.comments
                        comments_object.length = 0
                        comments_object.lengthe = "testing"

                    }
                    console.log( "new pad obj", current_pad )
                    console.log( "new comment obj", comments_object )
                        // update the length. (this is important as wont happen automaticaly)
                    comments_object.length++;
                    // create new object with its key as the new id then populate it.
                    comments_object[ new_object.id ]
                    comments_object[ new_object.id ] = new_object
                        // a check to see if $apply() is already running and if not run it.
                    console.info( "$scope.page.data", $scope.page.data )
                    if ( !$scope.$$phase ) {
                        $scope.$apply( )
                    }
                } )
        }
        //////////////////////////////////
        // comments end
        //////////////////////////////////
    $scope.search_contact = function ( ) {
        if ( !$scope.page.models.search.displayName ) {
            return
        }
        input = {
            search: $scope.page.models.search.displayName,
        }
        FirebaseServ.search_contacts( input ).then( function ( output ) {
            console.log( output )
        } )
    }

    $scope.flip = function ( group_id, pad_key ) {
        //create reference to scoped object
        pads_object = $scope.page.data.groups[ group_id ].pads[ pad_key ]
            // check that flipped exsists and if it doesnt set it to false
        if ( typeof ( pads_object.flipped ) === "undefeined" ) {
            pads_object.flipped = false;
        }
        // toggle the flipped between true/false
        pads_object.flipped = !pads_object.flipped
    }
} );
//////////////////////////////////
//FlipCtrl end
//////////////////////////////////
