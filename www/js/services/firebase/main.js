//////////////////////////////////
//firebaseServ start
//////////////////////////////////
app.factory( 'FirebaseServ', function ( $q, $state )
{
    //global refference to the current user
    current_user = {}
    uid = function ( only_uid = false )
    {
        // create a promise
        return $q( function ( resolve, reject )
        { 
            // do we already have user data?
            // if no -
            if ( Object.keys( current_user ).length < 1 )
            {
                // get user data from Auth
                try
                {
                    firebase.auth( ).onAuthStateChanged( function ( user )
                    {
                        if ( user )
                        {
                            // set global ref
                            current_user = user
                                // only return the uid
                            if ( only_uid )
                            {
                                resolve( user.uid )
                            } 
                            // return full user obj
                            resolve( user )
                        }
                        else
                        {
                            // kick user to log in screen
                            $state.go( 'auth' )
                            reject( )
                        }
                    } )
                }
                catch ( error )
                {
                    // couldnt determin if they logged in
                    $state.go( 'auth' )
                    reject( )
                }
            }
            // if yes -
            else
            {
                if ( only_uid )
                {
                    // only return the uid
                    resolve( current_user.uid )
                }
                // return full user obj
                resolve( current_user )
            }
        } )
    }
    create_user = function ( user_data )
    {
        // add timestamp
        user_data.private.timestamp = Date.now( )

        // I would normaly use post here but users has a different structure
        // create default group
        var displayName = user_data.public.displayName || "";
        return post_group(
        {
            uid: user_data.private.uid,
            title: `Welcome ${displayName}!`
        } ).then( function ( groups )
        {
            temp_obj = {};
            user_data.groups[ groups.id ] = true;
            // create default pad
            return post_pad(
            {
                group_id: groups.id,
                created_by: user_data.private.uid,
                title: "Your first note.",
                body: "Text goes here."
            } ).then( function ( )
            {
                var ref = firebase.database( ).ref( '/users/' );
                return ref.child( user_data.public.uid ).set( user_data ).then( function ( )
                {
                    // pass back the new user_data
                    return user_data;
                } ).catch( function ( error )
                {
                    // if error say so!
                    console.error( "error", error );
                    return {};
                } );

            } ).catch( function ( error )
            {
                // if error say so!
                console.error( "error", error );
                return {};
            } );
        } ).catch( function ( error )
        {
            // if error say so!
            console.error( "error", error ); 
            return {};
        } );
    }
    get_groups = function ( group_ids )
    {
        promise = [ ];
        // if there are no groud ids we need to return
        // but get_groups still needs to return a promise
        // with its associated object
        if ( !group_ids )
        {
            promise.push( $q( function ( )
            {
                return {};
            } ) )
            return $q.all( promise ).then( function ( outcome )
            {
                return outcome;
            } )
        }

        // for every group_id build a promise
        // and if successfull add the resolve value to an array
        keys = Object.keys( group_ids )
        for ( var i = 0; i < keys.length; i++ )
        {
            group_id = group_ids[ keys[ i ] ]
            current_group_id = keys[ i ]
            promise.push( $q( function ( resolve, reject )
            {
                return firebase.database( ).ref( '/groups/' ).child( current_group_id ).once( "value", function ( groups )
                {
                    resolve( groups.val( ) );
                } ).catch( function ( error )
                {
                    console.error( "[get_groups] We hit an error!", error )
                    reject( )
                } );
            } ) )
        }
        // once all promise have finished
        return $q.all( promise ).then( function ( output )
            {
                var output_obj = {};
                // clears out all undefined outputs and turns it into an object
                // i think this is now redundant but need ###TESTING###
                for ( var i = 0; i < output.length; i++ )
                {
                    if ( output[ i ] )
                    {
                        group_id = output[ i ].id
                        if ( output[ i ].pads )
                        {
                            var pads = output[ i ].pads
                            var pad_keys = Object.keys( pads )
                            for ( var x = 0; x < pad_keys.length; x++ )
                            {
                                var pad = pads[ pad_keys[ x ] ]
                                pad.priority_state = false
                                if ( pad.priority_time )
                                {
                                    pad.priority_time = new Date( pad.priority_time ).getTime( );
                                    pad.today_time = new Date( ).getTime( );
                                    pad.priority_time_diff = pad.priority_time - pad.today_time;
                                    pad.priority_days_diff = Math.round( pad.priority_time_diff / ( 1000 * 60 * 60 * 24 ) );
                                    // black = 0
                                    // red = 1
                                    // orange = 2
                                    // green = 3
                                    // grey = false

                                    if ( pad.priority_days_diff <= 0 )
                                    {
                                        //below 0
                                        pad.priority_state = 1
                                    }
                                    else if ( pad.priority_days_diff > 0 && pad.priority_days_diff <= 2 )
                                    {
                                        //between 1 - 2
                                        pad.priority_state = 2
                                    }
                                    else if ( pad.priority_days_diff > 2 && pad.priority_days_diff <= 4 )
                                    {
                                        //between 3 - 4
                                        pad.priority_state = 3
                                    }
                                    else if ( pad.priority_days_diff > 4 )
                                    {
                                        //above 4
                                        pad.priority_state = 4
                                    }
                                }
                            }
                        }
                        output_obj[ group_id ] = output[ i ]
                    }
                };
                console.log( "output_obj", output_obj )
                    // return output
                return output_obj;
            },
            function ( error )
            {
                console.error( "[get_groups][$q.all] We hit an error!", error )
                return {}
            } );
    }
    add_user_group = function ( arg )
    {
        // this is used to update the groups object for each user
        // output/structure should always be a hashmap
        var url = arg.url
        var ref = firebase.database( ).ref( url );
        var group_id = arg.group_id
        return ref.child( group_id ).set( true ).then( function ( )
        {
            return
        } ).catch( function ( error )
        {
            console.error( "error", error )
        } );
    }
    remove = function ( arg )
    {
        console.log( "removing -", arg )
        var url = arg.url
        var target = arg.target
        var ref = firebase.database( ).ref( url );
        return ref.child( target ).remove( ).catch( function ( error )
        {
            console.error( "error", error )
        } );
    }
    post = function ( arg )
    {
        // post acts as post and update
        console.log( "arg", arg )
        var ref = firebase.database( ).ref( arg.url );
        var output = arg.output;
        // if we are updating we use the target instead of generating a new key
        // I might add an extra flag to this so I can use post() for different objects
        var id = ( output.target ) ? output.target : ref.push( ).key;
        output.id = id
        output.timestamp = Date.now( )
        return ref.child( id ).set( output ).then( function ( )
        {
            return output;
        } ).catch( function ( error )
        {
            console.error( "error", error )
        } );
    }

    //////////////////////////////////
    // groups start
    //////////////////////////////////
    remove_group = function ( arg )
    {
        group_input = {
            url: `/groups/`,
            target: arg.group_id,
        }
        user_input = {
                url: `/users/${arg.uid}/groups/`,
                target: arg.group_id,
            }
            // remove the group
            // then remove the users reference to the group
        return remove( group_input ).then( function ( )
        {
            return remove( user_input )
        } ).catch( function ( error )
        {
            console.error( "We hit an error!", error )
            return {}
        } )
    }
    update_group = function ( arg )
    {
        console.log( "[update_group][arg]", arg )
        return uid( true ).then( function ( uid )
        {
            // ###TEMP###
            // removes lengths and flip states from arg
            // flip should be put in its own object
            // and im thinking of making an assiciative array of lengths
            // though that might be a pain to maintain
            pad_keys = [ ]
            pads = {}
            if ( arg.pads )
            {
                pad_keys = Object.keys( arg.pads )
                pads = arg.pads
            }
            for ( var i = 0; i < pad_keys.length; i++ )
            {
                current_pad = pads[ pad_keys[ i ] ]
                if ( pads.length )
                {
                    delete pads.length
                }
                if ( current_pad.flipped )
                {
                    delete current_pad.flipped
                }
                if ( current_pad.comments )
                {
                    comment = current_pad.comments
                    delete comment.length
                }
            }
            var input = {
                url: `/groups/`,
                target: arg.id,
                output: arg,
            }
            return post( input )
                .then( function ( output )
                {
                    var new_object = {
                        id: output.id,
                        title: output.title,
                        timestamp: output.timestamp
                    }
                    return new_object;
                } ).catch( function ( error )
                {
                    console.error( "We hit an error!", error )
                    return {}
                } )
        } ).catch( function ( error )
        {
            console.error( "We hit an error!", error )
            return {}
        } )
    }
    post_group = function ( arg )
        {
            return uid( true ).then( function ( uid )
            {
                console.log("arg",arg)
                var group_data = {
                    "url": `/groups/`,
                    "output":
                    {
                        "created_by": uid,
                        "title": arg.title || "Unknown Title.",
                        "favourite": arg.favourite||false,
                        "pads":arg.pads||{},
                        "users":arg.users||{},
                    },
                }
                group_data.output.users[ uid ] = true;
                group_data.output.target = ( arg.id ) ? arg.id : false;
                // update group object
                // then update the users group reference
                return post( group_data )
                    .then( function ( arg )
                    {
                        var data = {
                            url: `users/${arg.created_by}/groups/`,
                            group_id: arg.id,
                        }
                        add_user_group( data )
                        return arg;
                    } )
                    .then( function ( output )
                    {
                        console.log("main output",output)
                        // return the new group object for display
                        var new_object = {
                            created_by: output.created_by,
                            id: output.id,
                            title: output.title || "Unknown title.",
                            timestamp: output.timestamp || Date.now(),
                            favourite: output.favourite || false,
                            users: output.users || {},
                            pads: output.pads || {},
                        }
                        new_object.users[ output.created_by ] = true;
                        return new_object;
                    } ).catch( function ( error )
                    {
                        console.error( "We hit an error!", error )
                        return {}
                    } )
            } ).catch( function ( error )
            {
                console.error( "We hit an error!", error )
                return {}
            } )
        }
        //////////////////////////////////
        // groups end
        //////////////////////////////////
        //////////////////////////////////
        // pads start
        //////////////////////////////////
    remove_pad = function ( arg )
        {
            input = {
                url: `/groups/${arg.group_id}/pads/`,
                target: arg.pad_id,
            }
            return remove( input ).catch( function ( error )
            {
                console.error( "We hit an error!", error )
                return {}
            } )
        }
        // not yet done as couldnt fit it in the UX
    post_pad = function ( arg )
        {
            // get the uid then create input
            return uid( true ).then( function ( uid )
            {
                var pad_data = {
                    url: `/groups/${arg.group_id}/pads/`,
                    output:
                    {
                        priority_time: arg.priority_time.toString( ),
                        created_by: uid,
                        title: arg.title,
                        body: arg.body,
                    },
                };
                pad_data.output.target = ( arg.id ) ? arg.id : false;
                return post( pad_data )
                    .then( function ( output )
                    {
                        // return new pad
                        var new_object = {
                            body: output.body,
                            created_by: output.created_by,
                            id: output.id,
                            new_comment: '',
                            timestamp: output.timestamp,
                            priority_time: output.priority_time,
                            title: output.title,
                            comments:
                            {
                                length: 0
                            },
                        };
                        return new_object;
                    } ).catch( function ( error )
                    {
                        console.error( "We hit an error!", error )
                        return {}
                    } )
            } ).catch( function ( error )
            {
                console.error( "We hit an error!", error )
                return {}
            } )
        }
        //////////////////////////////////
        // pads end
        //////////////////////////////////
        //////////////////////////////////
        // comments start
        //////////////////////////////////
    remove_comment = function ( arg )
        {
            input = {
                url: `/groups/${arg.group_id}/pads/${arg.pad_id}/comments`,
                target: arg.comment_id,
            }
            return remove( input ).catch( function ( error )
            {
                console.error( "We hit an error!", error )
                return {}
            } )

        }
        // not yet done as couldnt fit it in the UX
    update_comment = function ( arg ) {}
    post_comment = function ( arg )
        {
            // get the uid then create input
            return uid( true ).then( function ( uid )
            {
                var data = {
                    url: `/groups/${arg.group_id}/pads/${arg.pad_id}/comments/`,
                    output:
                    {
                        created_by: uid,
                        body: arg.body,
                    }
                }
                return post( data )
                    // return new comment
                    .then( function ( output )
                    {
                        var new_object = {
                            id: output.id,
                            body: output.body,
                            timestamp: output.timestamp,
                            created_by: output.created_by,
                        }
                        return new_object;
                    } ).catch( function ( error )
                    {
                        console.error( "We hit an error!", error )
                        return {}
                    } )
            } ).catch( function ( error )
            {
                console.error( "We hit an error!", error )
                return {}
            } )
        }
        //////////////////////////////////
        // comments end
        //////////////////////////////////
        //////////////////////////////////
        // contact start
        //////////////////////////////////
        // general search function, but not yet full tested
    search = function ( arg )
        {
            ref = firebase.database( ).ref( arg.url )
            ref = ( arg.orderByChild ) ? ref.orderByChild( arg.orderByChild ) : ref;
            ref = ( arg.startAt ) ? ref.startAt( arg.startAt ) : ref;
            ref = ( arg.endAt ) ? ref.endAt( arg.endAt ) : ref;
            return ref.once( 'value' ).then( function ( output )
            {
                return output.val( )
            } )
        }
        // search users but their contactName
        // contactName is the displayName made lowerCase
    search_contacts = function ( arg )
        {
            input = {
                // probably broken with new rules
                url: `users/`,
                orderByChild: 'contactName',
                startAt: arg.search.toLowerCase( ),
            }
            console.log( input )
            return search( input ).then( function ( output )
            {
                return output
            } )
        }
        //////////////////////////////////
        // contact end
        //////////////////////////////////
    flat_stub = function ( )
        {
            return firebase.database( ).ref( "" ).once( 'value', function ( data )
            {
                return data;
            } )
        }
        // read indavidual parts of user object
    read_user = function ( arg )
    {
        //get user by uid and select the correct child
        var user_ref = firebase.database( ).ref( '/users/' ).child( arg.uid );
        return user_ref.child( arg.child ).once( 'value' ).then( function ( data )
        {
            return data.val( )
        } ).catch( function ( error )
        {
            console.error( "[read_user] We hit an error!", error )
            return {}
        } )
    }
    read_public = function ( uid )
    {
        return read_user(
        {
            uid: uid,
            child: 'public'
        } )
    }
    read_private = function ( uid )
    {
        return read_user(
        {
            uid: uid,
            child: 'private'
        } )
    }
    read_groups = function ( uid )
    {
        return read_user(
        {
            uid: uid,
            child: 'groups'
        } )
    }
    get_user_groups = function ( )
    {
        return get_user( )
    }
    get_user = function ( )
    {
        // get the uid then check that we can get the private data
        return uid( ).then( function ( user_data )
        {
            var displayName = user_data.displayName || user_data.email.substring( 0, user_data.email.indexOf( '@' ) );
            var contactName = displayName.toLowerCase( );
            var photoURL = user_data.photoURL || "";
            var current_user = {
                public:
                {
                    displayName: displayName,
                    contactName: contactName,
                    uid: user_data.uid,
                    photoURL: photoURL,
                },
                private:
                {
                    email: user_data.email,
                    emailVerified: user_data.emailVerified,
                    isAnonymous: user_data.isAnonymous,
                },
                groups:
                {},
            }
            return read_private( user_data.uid ).then( function ( private_data )
            {
                // if we can't get the private data then the user doesnt exsist
                if ( !private_data )
                {
                    // the new user object!
                    return create_user( current_user ).then( function ( user_data )
                    {
                        return user_data
                    } ).catch( function ( error )
                    {
                        console.error( "[create_user] We hit an error!", error )
                        return {}
                    } )
                }
                // if there is data, get the users groups and return the full user object
                return read_groups( user_data.uid ).then( function ( groups_ouput )
                {
                    current_user.groups = groups_ouput
                    return current_user
                } ).catch( function ( err )
                {
                    console.error( "[get_user]we have a error", err )
                } );
            } )
        } ).catch( function ( err )
        {
            console.error( "[get_user]we have a error", err )
        } );
    }

    // reference to all the Firebase.functions()
    return {
        get_user: get_user,
        uid: uid,
        create_user: create_user,
        get_user_groups: get_user_groups,
        get_groups: get_groups,
        remove_group: remove_group,
        update_group: update_group,
        post_group: post_group,
        remove_pad: remove_pad,
        post_pad: post_pad,
        remove_comment: remove_comment,
        update_comment: update_comment,
        post_comment: post_comment,
        search_contacts: search_contacts,
        search: search,
    };
} );

//////////////////////////////////
//firebaseServ end
//////////////////////////////////
