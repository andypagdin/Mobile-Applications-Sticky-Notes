//////////////////////////////////
//firebaseServ start
//////////////////////////////////

app.factory('Firebase', function ($q) {
	current_user = {}
	uid = function (uid) {
		return $q(function (resolve, reject) {
			if (Object.keys(current_user).length < 1) {
				firebase.auth().onAuthStateChanged(function (user) {
					if (user) {
						current_user = user
						if (uid) {
							resolve(user.uid)
						}
						resolve(user)
					}
					else {
						reject()
					}
				});
			}
			else {
				if (uid) {
					console.log("cu", current_user.uid)
					resolve(current_user.uid)
				}
				resolve(current_user)
			}
		})
	}
	get_user_groups = function () {
		return uid().then(function (user) {
			var url = `/users/${user.uid}/groups/`
			console.log("url", url)
			return firebase.database().ref(url).once('value', function (data) {
				return data.val()
			}).then(function (data) {
				if (data.val()) {
					console.log("groups")
					return output = {
						groups: data.val(),
						uid:user.uid,
					}
				}
				console.log("output")
				return output = {
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					uid: user.uid,
				}
			})
		})
	}
	create_user = function (user) {
		console.log("user", user)
		var ref = firebase.database().ref('/users');
		return ref.child(user.uid).set(user).then(function () {
			return user;
		}).catch(function (error) {
			console.error("error", error)
		});
	}
	get_groups = function (group_ids) {
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
			group_id = group_ids[keys[i]]
			current_group_id = keys[i]
			promise.push($q(function (resolve, reject) {
				if (!group_id.read) {
					return firebase.database().ref('/groups/').child(current_group_id).once("value", function (groups) {
						resolve(groups.val());
					}).catch(reject);
				}
				else {
					resolve();
				}
			}))
		}
		return $q.all(promise).then(function (outcome) {
			var outcome_obj = {}
			//clears out all undefined outputs and turns it into an object
			for (var i = 0; i < outcome.length; i++) {
				if (outcome[i]) {
					group_id = outcome[i].id
					outcome_obj[group_id] = outcome[i]
				}
			};
			//set lengths of each sub object
			outcome_obj.length = Object.keys(outcome_obj).length
			outcome_obj_keys = Object.keys(outcome_obj)
			for (var i = 0; i < outcome_obj.length; i++) {
				outcome = outcome_obj[outcome_obj_keys[i]]
				pads = outcome.pads
				if (pads) {
					pad_keys = Object.keys(pads)
					pads.length = Object.keys(pads).length
					for (var x = 0; x < pads.length; x++) {
						pad_obj = pads[pad_keys[x]]
						pad_obj.new_comment = ""
						comments = pad_obj.comments
						if (comments) {
							comments.length = Object.keys(comments).length
						}
					};
				}
			};
			return outcome_obj;
		}, function (reason) {
			console.error('Failed: ', reason);
			return reason;
		});
	}

	post = function (arg) {
		var url = arg.url
		var ref = firebase.database().ref(url);
		var id = ref.push().key;
		var output = arg.output
		output.id = id
		output.timestamp = Date.now()
		return ref.child(id).set(output).then(function () {
			return output;
		}).catch(function (error) {
			console.error("error", error)
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

	post_group = function (arg) {
		console.log("[post_group][arg]", arg)
		return uid(true).then(function (uid) {
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
						id: output.id,
						title: output.title,
						timestamp: output.timestamp,
						pads: {
							length: 0
						},
						users: {
						},
					}
					new_object.users[output.created_by] = true;
					return new_object;
				})
		})
	}
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
						id: output.id,
						title: output.title,
						body: output.body,
						timestamp: output.timestamp,
						created_by: output.created_by,
						comments: {
							length: 0
						},
					}
					return new_object;
				})
		})
	}
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
				})
		})
	}
	flat_stub = function () {
		return firebase.database().ref("").once('value', function (data) {
			return data;
		})
	}
	return {
		uid: uid,
		create_user: create_user,
		get_user_groups: get_user_groups,
		get_groups: get_groups,
		post_group: post_group,
		post_pad: post_pad,
		post_comment: post_comment,
	};
});

//////////////////////////////////
//firebaseServ end
//////////////////////////////////

