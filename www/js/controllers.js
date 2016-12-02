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

app.controller('AccordionCtrl', function ($scope, Firebase) {

  // $scope.page_data.groups = [];
  // for (var i = 0; i < 20; i++) {
  //   $scope.page_data.groups[i] = {
  //     name: i,
  //     items: []
  //   };
  //   for (var j = 0; j < 3; j++) {
  //     $scope.page_data.groups[i].items.push(i + '-' + j);
  //   }
  // }
  $scope.page_data = {}
  $scope.page_data.groups = {}
  $scope.page_data.comment_models = {}
  var group_ids = {}

  // Firebase.uid(true) gets uid
  // Firebase.uid() gets full user object
  // uid = Firebase.uid(true)

  // check user doesnt need a uid
  // Firebase.check_user(uid).then(function (data) {

    // user_details = data
    // console.log("user_details", user_details)

    // This wont work check user isnt in $scope its in Firebase
    // $scope/Firebase are like an objects but are at the same level
    // {$scope:{},Firebase:{}}
    // $scope.check_user(user_details.groups)

  // })


  Firebase.check_user().then(function (data) {
    user_details = data
    console.log("user_details", user_details)
  })

  $scope.get_user_groups = function (group_ids) {
    console.log("group_ids", group_ids)
    Firebase.check_user(group_ids)
      .then(function (groups) {
        console.log("groups", groups)
        $scope.page_data.groups = groups
      })
  }


  //togglestar
  $scope.toggleStar = function (group) {
    group.star = !group.star;
  }
  //delete function
  $scope.onItemDelete = function (group) {
    delete $scope.page_data.groups[group]
  }
  //ReOrder function
  $scope.moveItem = function (group, fromIndex, toIndex) {
    $scope.page_data.groups.splice(fromIndex, 1);
    $scope.page_data.groups.splice(toIndex, 0, group);

  };
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function (group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };
});

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


app.controller( 'addPadCtrl', function ( $scope, Firebase )
{
	$scope.page_data = {}
    $scope.page_data.groups = {}
    $scope.page_data.group_models = {}
    $scope.page_data.pad_models = {}
    $scope.page_data.pad_models["-KXNSUDZByXtgP6KaCQe"] = {} 
    $scope.page_data.comment_models = {}
    $scope.page_data.currentGroup = {
    	id:"-KXNSUDZByXtgP6KaCQe",
    	title:"",
    	body:"",
    }
    var group_ids = {}

	$scope.create_pad = function () {
        var title = $scope.page_data.currentGroup.title
        var body = $scope.page_data.currentGroup.body
        var input = {
            group_id: $scope.page_data.currentGroup.id,
            title: title,
            body: body,
        }        
        $scope.page_data.currentGroup.title = "";
        $scope.page_data.currentGroup.body = "";
        Firebase.post_pad(input)
            .then(function (new_object) {            	
                pads_object = $scope.page_data.groups[group_id].pads                
                if (!pads_object) {
                    pads_object = {}
                    pads_object.length = 0
                }
                pads_object[new_object.id] = {}
                pads_object[new_object.id] = new_object
                pads_object.length++
                console.log("pads_object", pads_object)
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }


} );
//////////////////////////////////
//ChatsCtrl start
//////////////////////////////////

app.controller( 'ChatsCtrl', function ( $scope, Chats )
{
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	$scope.chats = Chats.all( );
	$scope.remove = function ( chat )
	{
		Chats.remove( chat );
	};
} )

//////////////////////////////////
//ChatsCtrl end
//////////////////////////////////


//////////////////////////////////
//ChatDetailCtrl start
//////////////////////////////////

app.controller( 'ChatDetailCtrl', function ( $scope, $stateParams, Chats )
{
	$scope.chat = Chats.get( $stateParams.chatId );
} )

//////////////////////////////////
//ChatDetailCtrl end
//////////////////////////////////


//////////////////////////////////
//DashCtrl start
//////////////////////////////////

app.controller('DashCtrl', function ($scope, $state) {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			$scope.signed_out = false
			$scope.displayName = user.displayName
		}
		else {
			$state.go( 'login' );
			$scope.signed_out = true
		}
	});
	$scope.sign_out = function () {
		firebase.auth().signOut().then(function () {
			console.log('Signed Out');
		}, function (error) {
			console.error('Sign Out Error', error);
		});
	}
});

//////////////////////////////////
//DashCtrl end
//////////////////////////////////


//////////////////////////////////
//FazAccoubtCtrl start
//////////////////////////////////

app.controller( 'FazAccountCtrl', function ( $scope )
{

} );

//////////////////////////////////
//FazAccoubtCtrl end
//////////////////////////////////

//////////////////////////////////
//Login_Faz_Ctrl start
//////////////////////////////////

app.controller( 'Login_Faz_Ctrl', function ( $scope )
{
	console.log('Login_Faz_Ctrl')
} );

//////////////////////////////////
//Login_Faz_Ctrl end
//////////////////////////////////


//////////////////////////////////
//FlipCtrl start
//////////////////////////////////
app.controller('FlipCtrl', function ($scope, Firebase) {
    //////////////////////////////////
    // Information - JH
    // -------------------------------
    // intro to function structure,
    // All Firebase.functions are asynchronous
    // because of this we use the .then() method
    // which returns once the Firebase function has finished running
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
    // Firebase.check_user().then(function (output) {
    //     console.log("users", output)
    // })
    // Firebase.get_groups2().then(function (output) {
    //     console.log("users", output)
    //     // assign current user
    //     // $scope.page.data.uid = input.uid
    //     // assign current users groups
    //     $scope.page.data.groups = output
    // })
    console.log("running")
    // getting the users groups
    Firebase.check_user().then(function (user_output) {
        // are there any groups?
        console.log("user_output --- ", user_output)
        // return
        if (user_output.groups) {
            // get the group objects
            console.log("user_output.groups --- ", user_output.groups)
            $scope.get_groups(user_output)
            console.warn("data", $scope.page.data)
        }
        else {
            // no groups means the user isnt create as they will
            // always have a default group, so we create that new user.
            Firebase.create_user(user_output).then(function (new_user_output) {
                post_group({
                    created_by: user_output.public.uid,
                    title: 'general',
                }).then(function (group_output) {
                    group_object = $scope.page.data.groups
                    group_object.length = 0
                    group_object[group_output.id] = group_output
                    $scope.page.data.uid = group_output.created_by
                    group_object[group_output.id].users[group_output.created_by] = true
                    post_pad({
                        group_id: group_output.id,
                        created_by: user_output.public.uid,
                        title: 'Your first note!',
                        body: 'This is an example note, flip me over to add a comment!',
                    }).then(function (pad_output) {
                        pads_object = $scope.page.data.groups[group_output.id].pads
                        pads_object.length = 0
                        pads_object[pad_output.id] = {}
                        pads_object[pad_output.id] = pad_output
                        if (!$scope.$$phase) {
                            $scope.$apply()
                        }
                        console.warn("data", $scope.page.data)
                    })
                })
            })
        }
    })

    $scope.get_groups = function (input) {
        // trigger Firebase function.
        Firebase.get_groups(input.groups)
            .then(function (groups) {
                console.info("input", input)
                console.info("groups", groups)
                // assign current user
                $scope.page.data.uid = input.public.uid
                // assign current users groups
                $scope.page.data.groups = groups
            })
    }

    $scope.remove_group = function (group_id) {
        // build input.
        var input = {
            uid: $scope.page.data.uid,
            group_id: group_id,
        }
        // trigger Firebase function.
        Firebase.remove_group(input).then(function (output) {
            delete $scope.page.data.groups[group_id]
            // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups.length--
            // a check to see if $apply() is already running and if not run it.
            if (!$scope.$$phase) {
                $scope.$apply()
            }
        })
    }

    $scope.update_group = function (group_id) {
        group = $scope.page.models.group.edit[group_id]
        if (!group) {
            return
        }
        // build input.
        var input = $scope.page.data.groups[group_id]
        input.title = group.title
        // clear page inputs values and UX.
        $scope.page.models.group.edit[group_id].title = "";
        // trigger Firebase function.
        Firebase.update_group(input)
            .then(function (output) {
                group_object = $scope.page.data.groups[output.id]
                group_object.title = output.title
                group_object.timestamp = output.timestamp
                //a check to see if $apply() is already running and if not run it.
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    $scope.create_group = function () {
        // build input.
        var title = $scope.page.models.group.create.title
        if (!title) {
            return
        }
        var input = {
            title: title,
        }
        // clear page inputs values and UX.
        $scope.page.models.group.create.title = "";
        // trigger Firebase function.
        Firebase.post_group(input)
            .then(function (new_object) {
                group_object = $scope.page.data.groups
                if (!group_object) {
                    group_object = {}
                    group_object.length = 0
                }
                // update the length. (this is important as wont happen automaticaly)
                group_object.length++;
                // create new object with its key as the new id then populate it.
                group_object[new_object.id] = new_object
                $scope.page.data.uid = new_object.created_by
                // tell the new group to allow the current user to access it.
                group_object[new_object.id].users[new_object.created_by] = true
                // a check to see if $apply() is already running and if not run it.
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    //////////////////////////////////
    // groups end
    //////////////////////////////////
    //////////////////////////////////
    // pads start
    //////////////////////////////////
    $scope.remove_pad = function (group_id, pad_id) {
        // build input.
        var input = {
            group_id: group_id,
            pad_id: pad_id,
        }
        // trigger Firebase function.
        Firebase.remove_pad(input).then(function (output) {
            delete $scope.page.data.groups[group_id].pads[pad_id]
            // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups[group_id].pads.length--
            // a check to see if $apply() is already running and if not run it.
            if (!$scope.$$phase) {
                $scope.$apply()
            }
        })
    }
    $scope.create_pad = function (group_id) {
        // get the data from the page inputs.
        var title = $scope.page.models.pad.create[group_id].title
        var body = $scope.page.models.pad.create[group_id].body
        // build input.
        var input = {
            group_id: group_id,
            title: title,
            body: body,
        }
        // clear page inputs values and UX.
        $scope.page.models.pad.create[group_id].title = "";
        $scope.page.models.pad.create[group_id].body = "";
        // trigger Firebase function.
        Firebase.post_pad(input)
            .then(function (new_object) {
                // get current list of pads.
                pads_object = $scope.page.data.groups[group_id].pads
                // if there isnt any pads make a empty pads array and set the length to 0.
                if (!pads_object) {
                    pads_object = {}
                    pads_object.length = 0
                }
                // update the length. (this is important as wont happen automaticaly)
                pads_object.length++;
                // create new object with its key as the new id then populate it.
                pads_object[new_object.id] = {}
                pads_object[new_object.id] = new_object
                // a check to see if $apply() is already running and if not run it.
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    //////////////////////////////////
    // pads end
    //////////////////////////////////
    //////////////////////////////////
    // comments start
    //////////////////////////////////
    $scope.remove_comment = function (group_id, pad_id, comment_id) {
        // build input.
        var input = {
            group_id: group_id,
            pad_id: pad_id,
            comment_id: comment_id,
        }
        // trigger Firebase function.
        Firebase.remove_comment(input).then(function (output) {
            delete $scope.page.data.groups[group_id].pads[pad_id].comments[comment_id]
            // update the length. (this is important as wont happen automaticaly)
            $scope.page.data.groups[group_id].pads[pad_id].comments.length--
            // a check to see if $apply() is already running and if not run it.
            if (!$scope.$$phase) {
                $scope.$apply()
            }
        })
    }
    $scope.create_comment = function (group_id, pad_id) {
        // build input.
        var body = $scope.page.models.comment.create[pad_id].body
        var input = {
            group_id: group_id,
            pad_id: pad_id,
            body: body,
        }
        console.info(input)
        // clear page inputs values and UX.
        $scope.page.models.comment.create[pad_id].body = "";
        // trigger Firebase function.
        Firebase.post_comment(input)
            .then(function (new_object) {
                console.info("new_object", new_object)
                console.info("$scope.page.data", $scope.page.data)
                current_pad = $scope.page.data.groups[input.group_id].pads[input.pad_id]
                comments_object = current_pad.comments
                if (!comments_object) {
                    current_pad.comments = {}
                    comments_object = current_pad.comments
                    comments_object.length = 0
                    comments_object.lengthe = "testing"

                }
                console.log("new pad obj", current_pad)
                console.log("new comment obj", comments_object)
                // update the length. (this is important as wont happen automaticaly)
                comments_object.length++;
                // create new object with its key as the new id then populate it.
                comments_object[new_object.id]
                comments_object[new_object.id] = new_object
                // a check to see if $apply() is already running and if not run it.
                console.info("$scope.page.data", $scope.page.data)
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }
    //////////////////////////////////
    // comments end
    //////////////////////////////////
    $scope.search_contact = function () {
        if (!$scope.page.models.search.displayName) {
            return
        }
        input = {
            search: $scope.page.models.search.displayName,
        }
        Firebase.search_contacts(input).then(function (output) {
            console.log(output)
        })
    }

    $scope.flip = function (group_id, pad_key) {
        //create reference to scoped object
        pads_object = $scope.page.data.groups[group_id].pads[pad_key]
        // check that flipped exsists and if it doesnt set it to false
        if (typeof (pads_object.flipped) === "undefeined") {
            pads_object.flipped = false;
        }
        // toggle the flipped between true/false
        pads_object.flipped = !pads_object.flipped
    }
});
//////////////////////////////////
//FlipCtrl end
//////////////////////////////////

//////////////////////////////////
//FromCtrl start
//////////////////////////////////

app.controller( 'FromCtrl', function ( $scope )
{
	// Initialize Firebase
	$scope.fb_value = "testing"
	read_ref = firebase.database( ).ref( )
	set_ref = firebase.database( ).ref( 'level1/' )

	// set_ref.set(
	// {
	// 	"l1 subkey1": "timestamp = 1"
	// } );
	uuid = 'Ucg7kUNTceQjOLqDIwByHLz5FPj2'
	firebase.database( )
		.ref( `/johnny/users/${uuid}/groups` ).once( 'value', function ( data )
		{
			console.log( "[Users]", data.val( ) )
			angular.forEach( data.val( ), function ( value, index )
			{
				if ( value.read ) return;
				console.log( index )
				var ref = firebase.database( ).ref( `/johnny/groups/` )
				ref = ref.equalTo( index );
				console.log( ref )
					// 	var ref = ref.orderByChild( "has_changed" ).equalTo( true );
				ref.once( "value", function ( data )
				{
					console.log( "[Groups]", data.val( ) )
				} );
			} );
		} );


	// read_ref.once( 'value', function ( snap )
	// {
	// 	$scope.fb_value = pretty( snap.val( ) )
	// 	console.log( "ooooooooooohhhhhh snap", snap.val( ) )
	// } )
	// var ref = firebase.database( ).ref( "/johnny/data/groups/" );
	// var ref = ref.orderByChild( "has_changed" ).equalTo( true );
	// var ref = ref.child( "uuid" );
	// ref.once( "value", function ( data )
	// {
	// 	console.log( data.val( ) )
	// } );

	// firebase.database( )
	// 	.ref( '/johnny/data/users/6X2Yka97bOOomPD1cN9VDj9VryK2/groups' ).once( 'value', function ( snap )
	// 	{
	// 		angular.forEach( snap.val( ), function ( value, index )
	// 		{
	// 			console.log( value.key )
	// 			firebase.database( )
	// 				.ref( '/johnny/data/groups/' )
	// 				.child( value.key )
	// 				.orderByChild( 'has_changed' )
	// 				.startAt( 'true' ).endAt( 'true' )
	// 				// .orderBy('lead')                  // !!! THIS LINE WILL RAISE AN ERROR !!!
	// 				// .startAt('Jack Nicholson').endAt('Jack Nicholson')
	// 				// .orderByChild( 'has changed' )
	// 				// .child( 'has changed' )
	// 				// .equalTo( 'true' )
	// 				.once( 'value', function ( snap )
	// 				{
	// 					// console.log( key, value );
	// 					console.log( 'Group == ', snap.val( ) );
	// 				} );
	// 		} );


	// 	} );


} )

//////////////////////////////////
//FromCtrl end
//////////////////////////////////


//////////////////////////////////
//DashCtrl start
//////////////////////////////////

app.controller( 'HomeCtrl', function ( $scope )
{

} );

//////////////////////////////////
//DashCtrl end
//////////////////////////////////

//////////////////////////////////
//LoginCtrl start
//////////////////////////////////

app.controller( 'LoginCtrl', function ( $scope, $state )
{
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

	$scope.googleSignIn = function ( )
    {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithRedirect(provider);

    }


	/**
	 * Handles the sign in button press.
	 */
	$scope.toggleSignIn = function ( )
	{
		if ( firebase.auth( ).currentUser )
		{
			// [START signout]
			firebase.auth( ).signOut( );
			// [END signout]
		}
		else
		{
			var email = $scope.auth.email;
			var password = $scope.auth.password;
			if ( !email || email.length < 4 )
			{
				$scope.error_output.user = 'Please enter an email address.';
				return;
			}
			if ( !password || password.length < 4 )
			{
				$scope.error_output.user = 'Please enter a password.';
				return;
			}
			// Sign in with email and pass.
			// [START authwithemail]
			firebase.auth( ).signInWithEmailAndPassword( email, password ).catch( function ( error )
			{
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// [START_EXCLUDE]
				if ( errorCode === 'auth/wrong-password' )
				{
					$scope.error_output.user = "Wrong password."
				}
				else
				{
					$scope.error_output.admin = "Wrong password."
					console.error( errorMessage );
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
	$scope.handleSignUp = function ( )
	{
		var email = $scope.auth.email;
		var password = $scope.auth.password;
		if ( email.length < 4 )
		{
			console.info( 'Please enter an email address.' );
			return;
		}
		if ( password.length < 4 )
		{
			console.info( 'Please enter a password.' );
			return;
		}
		// Sign in with email and pass.
		// [START createwithemail]
		firebase.auth( ).createUserWithEmailAndPassword( email, password ).catch( function ( error )
		{
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// [START_EXCLUDE]
			if ( errorCode == 'auth/weak-password' )
			{
				console.error( 'The password is too weak.' );
			}
			else
			{
				console.error( errorMessage );
			}
			console.log( error );
			// [END_EXCLUDE]
		} );
		// [END createwithemail]
	}

	$scope.sendPasswordReset = function ( )
		{
			var email = $scope.auth.email;
			// var email = document.getElementById( 'email' ).value;
			// [START sendpasswordemail]
			firebase.auth( ).sendPasswordResetEmail( email ).then( function ( )
			{
				// Password Reset Email Sent!
				// [START_EXCLUDE]
				console.info( 'Password Reset Email Sent!' );
				// [END_EXCLUDE]
			} ).catch( function ( error )
			{
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// [START_EXCLUDE]
				if ( errorCode == 'auth/invalid-email' )
				{
					console.error( errorMessage );
				}
				else if ( errorCode == 'auth/user-not-found' )
				{
					console.error( errorMessage );
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
	$scope.initApp = function ( )
	{
		// Listening for auth state changes.[START authstatelistener]
		firebase.auth( ).onAuthStateChanged( function ( user )
		{
			console.log( "AUTH CHANGE", user )
				// [START_EXCLUDE silent]
				// document.getElementById('quickstart-verify-email').disabled = true;
			$scope.verifyable = true
				// [END_EXCLUDE]
			if ( user )
			{
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
				if ( displayName )
				{
					$state.go( 'tab.dash' );
					console.log( "display name set " + displayName )
				}
				else
				{
					$state.go( 'name' );
					console.log( "display name not set" )
				}

				console.log( "view should have changed with this data - ", $scope.user_data )

				// document.getElementById( 'quickstart-sign-in-status' ).textContent = 'Signed in';
				// document.getElementById( 'quickstart-sign-in' ).textContent = 'Sign out';
				// document.getElementById( 'quickstart-account-details' ).textContent = JSON.stringify( user, null, '  ' );
				if ( !emailVerified )
				{

					$scope.verifyable = false
						// document.getElementById( 'quickstart-verify-email' ).disabled = false;
				}
				// [END_EXCLUDE]
			}
			else
			{
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

	$scope.updateDisplayName = function ( )
	{

		var user = firebase.auth( ).currentUser;

		var displayName = $scope.input.displayName

		user.updateProfile(
		{
			displayName: displayName
		} ).then( function ( )
		{
			$state.go( 'tab.dash' )
			console.log( "update success " + displayName )
		}, function ( error )
		{
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
//FazCtrl start
//////////////////////////////////

app.controller( 'Login_Faz_Ctrl', function ( $scope )
{

} );

//////////////////////////////////
//FazCtrl end
//////////////////////////////////

app.controller( 'NavCtrl', function ( $scope, $location )
{
	$scope.go = function ( path ) {
    $location.path( path );
  };
} );
app.controller( 'testCtrl', function ( $scope ) {} )

