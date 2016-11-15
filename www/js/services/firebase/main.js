//////////////////////////////////
//firebaseServ start
//////////////////////////////////

app.factory('Firebase', function ($q) {
	get_user_groups = function (uuid) {
		console.info("get_user_groups", uuid)
		return firebase.database().ref(`/users/${uuid}/groups`).once('value', function (data) {
			return data;
		})
	}
	get_groups = function (group_ids) {
		promise = []
		keys = Object.keys(group_ids)
		for (var i = 0; i < keys.length; i++) {
			group_id = group_ids[keys[i]]
			read = group_id.read
			current_group_id = keys[i]
			promise.push($q(function (resolve, reject) {
				if (!read) {
					return firebase.database().ref(`/groups/${current_group_id}`).once("value", function (groups) {
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
					outcome_obj[i] = outcome[i]
				}
			};
			//set lengths of each sub object
			outcome_obj.length = Object.keys(outcome_obj).length
			for (var i = 0; i < outcome_obj.length; i++) {
				users = outcome_obj[i].users
				users.length = Object.keys(users).length
				pads = outcome_obj[i].pads
				pad_keys = Object.keys(pads)
				pads.length = Object.keys(pads).length
				for (var x = 0; x < pads.length; x++) {
					pad_obj = pads[pad_keys[x]]
					pad_obj.new_comment = ""
					comments = pad_obj.comments
					comments.length = Object.keys(comments).length
				};
			};
			return outcome_obj;
		}, function (reason) {
			console.log('Failed: ', reason);
			return reason;
		});
	}
	post_comment = function (arg) {
		var ref = firebase.database().ref(`/groups/${arg.group_id}/pads/${arg.pad_id}/comments/`);
		var comment_id = ref.push().key;
		var comment_output = {
			content: arg.comment,
			comment_id: comment_id,
			sent: arg.sent,
			user_id: arg.user_id
		}

		// Write the session to the database
		ref.child(`${comment_id}`).set(comment_output).then(function () {
			// Finally, finish with session information
			// return comment_output;
		}).catch(function (error) {
			console.error("error", error)
		});
	}
	flat_stub = function () {
		return firebase.database().ref("").once('value', function (data) {
			return data;
		})
	}
	return {
		get_user_groups: get_user_groups,
		get_groups: get_groups,
		post_comment: post_comment
	};
});

//////////////////////////////////
//firebaseServ end
//////////////////////////////////

