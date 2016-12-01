//////////////////////////////////
//firebaseServ start
//////////////////////////////////

app.factory('Firebase', function ($q, $state) {
	current_user = {}
	uid = function (uid) {
		return $q(function (resolve, reject) {
			if (Object.keys(current_user).length < 1) {
				firebase.auth().onAuthStateChanged(function (user) {
					console.warn("user", user)
					if (user) {
						current_user = user
						if (uid) {
							resolve(user.uid)
						}
						resolve(user)
					}
					else {
						$state.go('login')
						reject()
					}
				});
			}
			else {
				if (uid) {
					console.log("[uid][else]current_user", current_user.public.uid)
					resolve(current_user.public.uid)
				}
				resolve(current_user)
			}
		})
	}
	create_user = function (user_data) {
		console.log("user_data", user_data)
		user_data.private.timestamp = Date.now()
		var input = {
			url: `/users/`,
			target: user_data.public.uid,
			update: true,
			output: user_data,
		}
		console.log("[create_user][input]", input)
		var ref = firebase.database().ref('/users/');
		return ref.child(user_data.public.uid).set(input.output).then(function () {
			return input;
		}).catch(function (error) {
			console.error("error", error)
		});
	}
	get_groups = function (group_ids) {
		console.info(group_ids)
		promise = []
		if (!group_ids) {
			promise.push($q(function () {
				return {};
			}))
			return $q.all(promise).then(function (outcome) {
				return outcome;
			})
		}
		keys = Object.keys(group_ids)
		for (var i = 0; i < keys.length; i++) {
			console.info(i)
			group_id = group_ids[keys[i]]
			current_group_id = keys[i]
			promise.push($q(function (resolve, reject) {
				if (!group_id.read) {
					return firebase.database().ref('/groups/').child(current_group_id).once("value", function (groups) {
						resolve(groups.val());
					}).catch(function (error) {
						console.error("[get_groups] We hit an error!", error)
						reject()
					});
				}
				else {
					resolve();
				}
			}))
		}
		return $q.all(promise).then(function (outcome) {
			var outcome_obj = {}
			// clears out all undefined outputs and turns it into an object
			for (var i = 0; i < outcome.length; i++) {
				if (outcome[i]) {
					group_id = outcome[i].id
					outcome_obj[group_id] = outcome[i]
				}
			};
			return outcome_obj;
		}, function (error) {
			console.error("[get_groups][$q.all] We hit an error!", error)
			return {}
		});
	}
	add_user_group = function (arg) {
		console.log("[add_user_group][arg]", arg)
		var url = arg.url
		var ref = firebase.database().ref(url);
		var group_id = arg.group_id
		return ref.child(group_id).set(true).then(function () {
			return
		}).catch(function (error) {
			console.error("error", error)
		});
	}
	remove = function (arg) {
		console.log("removing -", arg)
		var url = arg.url
		var target = arg.target
		var ref = firebase.database().ref(url);
		return ref.child(target).remove().catch(function (error) {
			console.error("error", error)
		});
	}
	post = function (arg) {
		console.info("[post] arg", arg)
		var url = arg.url
		var ref = firebase.database().ref(url);
		var output = arg.output
		var id = (arg.update) ? arg.target : ref.push().key;
		output.id = id
		output.timestamp = Date.now()
		return ref.child(id).set(output).then(function () {
			return output;
		}).catch(function (error) {
			console.error("error", error)
		});
	}

	//////////////////////////////////
	// groups start
	//////////////////////////////////
	remove_group = function (arg) {
		group_input = {
			url: `/groups/`,
			target: arg.group_id,
		}
		user_input = {
			url: `/users/${arg.uid}/groups/`,
			target: arg.group_id,
		}

		return remove(group_input).then(function () {
			return remove(user_input)
		}).catch(function (error) {
			console.error("We hit an error!", error)
			return {}
		})
	}
	update_group = function (arg) {
		console.log("[update_group][arg]", arg)
		return uid(true).then(function (uid) {
			pad_keys = []
			pads = {}
			if (arg.pads) {
				pad_keys = Object.keys(arg.pads)
				pads = arg.pads
			}
			for (var i = 0; i < pad_keys.length; i++) {
				current_pad = pads[pad_keys[i]]
				if (pads.length) {
					delete pads.length
				}
				if (current_pad.flipped) {
					delete current_pad.flipped
				}
				if (current_pad.comments) {
					comment = current_pad.comments
					delete comment.length
				}
			}
			var input = {
				url: `/groups/`,
				target: arg.id,
				update: true,
				output: arg,
			}
			console.log("[update_group][input]", input)
			return post(input)
				.then(function (output) {
					var new_object = {
						id: output.id,
						title: output.title,
						timestamp: output.timestamp
					}
					console.log("!new_object!", new_object)
					return new_object;
				}).catch(function (error) {
					console.error("We hit an error!", error)
					return {}
				})
		}).catch(function (error) {
			console.error("We hit an error!", error)
			return {}
		})
	}
	post_group = function (arg) {
		console.log("[post_group][arg]", arg)
		return uid(true).then(function (uid) {
			console.log("uid", uid)
			console.log("arg", arg)
			var data = {
				url: `/groups/`,
				output: {
					created_by: uid,
					title: arg.title,
					pads: {},
					users: {},
				},
			}
			data.output.users[uid] = true
			console.log("[post_group][uid]", uid)
			console.log("[post_group][data]", data)
			return post(data)
				.then(function (arg) {
					console.log("[post return][arg]", arg)
					var data = {
						url: `users/${arg.created_by}/groups/`,
						group_id: arg.id,
					}
					add_user_group(data)
					return arg;
				})
				.then(function (output) {
					console.log("!ouput!", output)
					var new_object = {
						created_by: output.created_by,
						id: output.id,
						title: output.title,
						timestamp: output.timestamp,
						users: {
						},
						pads: {
						},
					}
					new_object.users[output.created_by] = true;
					return new_object;
				}).catch(function (error) {
					console.error("We hit an error!", error)
					return {}
				})
		}).catch(function (error) {
			console.error("We hit an error!", error)
			return {}
		})
	}
	//////////////////////////////////
	// groups end
	//////////////////////////////////
	//////////////////////////////////
	// pads start
	//////////////////////////////////
	remove_pad = function (arg) {
		input = {
			url: `/groups/${arg.group_id}/pads/`,
			target: arg.pad_id,
		}
		return remove(input).catch(function (error) {
			console.error("We hit an error!", error)
			return {}
		})
	}
	update_pad = function (arg) { }
	post_pad = function (arg) {
		console.log("[post_pad][arg]", arg)
		return uid(true).then(function (uid) {
			var data = {
				url: `/groups/${arg.group_id}/pads/`,
				output: {
					created_by: uid,
					title: arg.title,
					body: arg.body,
				},
			}
			console.log("[post_pad][data]", data)
			return post(data)
				.then(function (output) {
					var new_object = {
						body: output.body,
						created_by: output.created_by,
						id: output.id,
						new_comment: '',
						timestamp: output.timestamp,
						title: output.title,
						comments: {
							length: 0
						},
					}
					return new_object;
				}).catch(function (error) {
					console.error("We hit an error!", error)
					return {}
				})
		}).catch(function (error) {
			console.error("We hit an error!", error)
			return {}
		})
	}
	//////////////////////////////////
	// pads end
	//////////////////////////////////
	//////////////////////////////////
	// comments start
	//////////////////////////////////
	remove_comment = function (arg) {
		input = {
			url: `/groups/${arg.group_id}/pads/${arg.pad_id}/comments`,
			target: arg.comment_id,
		}
		return remove(input).catch(function (error) {
			console.error("We hit an error!", error)
			return {}
		})

	}
	update_comment = function (arg) { }
	post_comment = function (arg) {
		console.log("[post_comment][arg]", arg)
		return uid(true).then(function (uid) {
			var data = {
				url: `/groups/${arg.group_id}/pads/${arg.pad_id}/comments/`,
				output: {
					created_by: uid,
					body: arg.body,
				}
			}
			console.log("[post_comment][data]", data)
			return post(data)
				.then(function (output) {
					var new_object = {
						id: output.id,
						body: output.body,
						timestamp: output.timestamp,
						created_by: output.created_by,
					}
					return new_object;
				}).catch(function (error) {
					console.error("We hit an error!", error)
					return {}
				})
		}).catch(function (error) {
			console.error("We hit an error!", error)
			return {}
		})
	}
	//////////////////////////////////
	// comments end
	//////////////////////////////////
	//////////////////////////////////
	// contact start
	//////////////////////////////////
	search = function (arg) {
		ref = firebase.database().ref(arg.url)
		ref = (arg.orderByChild) ? ref.orderByChild(arg.orderByChild) : ref;
		ref = (arg.startAt) ? ref.startAt(arg.startAt) : ref;
		ref = (arg.endAt) ? ref.endAt(arg.endAt) : ref;
		return ref.once('value').then(function (output) {
			return output.val()
		})
	}
	search_contacts = function (arg) {
		input = {
			url: `users/`,
			orderByChild: 'contactName',
			startAt: arg.search.toLowerCase(),
		}
		console.log(input)
		return search(input).then(function (output) {
			return output
		})
	}
	//////////////////////////////////
	// contact end
	//////////////////////////////////
	flat_stub = function () {
		return firebase.database().ref("").once('value', function (data) {
			return data;
		})
	}
	read_user = function (arg) {
		console.info("[read_user]ARG", arg)
		var user_ref = firebase.database().ref('/users/').child(arg.uid);
		return user_ref.child(arg.child).once('value').then(function (data) {
			console.log("[read_user]", data.val())
			return data.val()
		}).catch(function (error) {
			console.error("[read_user] We hit an error!", error)
			return {}
		})
	}
	read_public = function (uid) {
		return read_user({ uid: uid, child: 'public' })
	}
	read_private = function (uid) {
		return read_user({ uid: uid, child: 'private' })
	}
	read_groups = function (uid) {
		return read_user({ uid: uid, child: 'groups' })
	}
	get_user_groups = function (user_data) {
		return check_user(user_data)
	}
	check_user = function (user_data) {
		return uid().then(function (user_data) {
			return read_private(user_data.uid).then(function (private_ouput) {
				if (!private_ouput) {
					return current_user = {
						public: {
							displayName: user_data.displayName,
							contactName: user_data.displayName.toLowerCase(),
							uid: user_data.uid,
							photoURL: user_data.photoURL,
						},
						private: {
							email: user_data.email,
							emailVerified: user_data.emailVerified,
							isAnonymous: user_data.isAnonymous,
						},
					}
				}
				return read_groups(user_data.uid).then(function (groups_ouput) {
					return current_user = {
						public: {
							displayName: user_data.displayName,
							contactName: user_data.displayName.toLowerCase(),
							uid: user_data.uid,
							photoURL: user_data.photoURL,
						},
						private: {
							email: user_data.email,
							emailVerified: user_data.emailVerified,
							isAnonymous: user_data.isAnonymous,
						},
						groups: groups_ouput,
					}
				})
			})
		})
	}

	return {
		check_user: check_user,
		uid: uid,

		create_user: create_user,
		get_user_groups: get_user_groups,
		get_groups: get_groups,
		remove_group: remove_group,
		update_group: update_group,
		post_group: post_group,
		remove_pad: remove_pad,
		update_pad: update_pad,
		post_pad: post_pad,
		remove_comment: remove_comment,
		update_comment: update_comment,
		post_comment: post_comment,
		search_contacts: search_contacts,
		search: search,
	};
});

//////////////////////////////////
//firebaseServ end
//////////////////////////////////

